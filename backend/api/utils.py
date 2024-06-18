import os
import io
import logging
import hashlib
from random import randint

import gspread
import pandas as pd
from google.cloud import storage
from google.resumable_media.requests import ResumableUpload
from google.auth.transport.requests import AuthorizedSession
from google.resumable_media import common
from google.cloud import firestore
import json
from .models import DataSource


class GCS:

    @staticmethod
    def upload_file(file_path, file_name, bucket_name):
        """
        Uploads a file to the bucket.
        file_name could be a single f-slash separated path.
        Returns object uri.
        """

        logging.info(f"Uploading {file_path} to GCS")

        storage_client = storage.Client()
        bucket = storage_client.bucket(bucket_name)
        blob = bucket.blob(file_name)

        blob.upload_from_filename(file_path)
        return f"gs://{bucket_name}/{file_name}"
    
    @staticmethod
    def read_file(file_path, bucket_name):
        """
        Reads a file from the bucket.
        file_name could be a single f-slash separated path.
        Returns object uri.
        """

        logging.info(f"Uploading {file_path} to GCS")

        storage_client = storage.Client()
        bucket = storage_client.bucket(bucket_name)
        blob = bucket.blob(file_path)

        # blob.upload_from_filename(file_path)
        data = json.loads(blob.download_as_string())
        return data

    @staticmethod
    def upload_file_content(file_obj, file_name, bucket_name):
        """
        Upload the file content to GCS bucket
        :param file_obj: a file-like object e.g io.BytesIO
        :param bucket_name: name of the bucket
        :param file_name: name of the file
        :return: uri
        """
        min_chunk_size = 256 * 1024  # Minimum chunk-size supported by GCS
        if isinstance(file_obj, io.BytesIO):
            file_size = file_obj.getbuffer().nbytes
        else:
            file_size = file_obj.size

        if file_size >= min_chunk_size:
            uri = GCS.upload_content_using_stream(file_obj, file_name, bucket_name)
        else:
            uri = GCS.upload_content_simple(file_obj.read(), file_name, bucket_name)

        return uri

    @staticmethod
    def upload_content_simple(content, file_name, bucket_name):
        """
        Uploads a file to the bucket. destination_folder could be a single f-slash separated path
        """
        try:
            storage_client = storage.Client()
            bucket = storage_client.bucket(bucket_name)
            blob = bucket.blob(file_name)

            blob.upload_from_string(content, content_type="utf-8")
            return f"gs://{bucket_name}/{file_name}"
        except Exception as e:
            logging.error(e)
            return None

    @staticmethod
    def upload_content_using_stream(content, file_name, bucket_name):
        """
        Uploads a file to the bucket in stream. minimum chunk size is 256 KB
        """
        try:
            content = content.file.read()
            chunk_size = 256 * 1024  # Minimum chunk-size supported by GCS
            stream = io.BytesIO(content)

            client = storage.Client()
            bucket = client.bucket(bucket_name)
            blob = bucket.blob(file_name)

            url = (
                f'https://www.googleapis.com/upload/storage/v1/b/'
                f'{bucket.name}/o?uploadType=resumable'
            )

            # Pass the URL off to the ResumableUpload object
            upload = ResumableUpload(
                upload_url=url,
                chunk_size=chunk_size
            )
            transport = AuthorizedSession(credentials=client._credentials)

            # Start using the Resumable Upload
            upload.initiate(
                transport=transport,
                content_type='application/octet-stream',
                stream=stream,
                stream_final=False,
                metadata={'name': blob.name}
            )

            buffer = b""
            buffer_size = len(content)
            buffer += content
            while buffer_size >= chunk_size:
                try:
                    upload.transmit_next_chunk(transport)
                except common.InvalidResponse:
                    upload.recover(transport)
                except ValueError as e:
                    logging.info(e)
                    break

            return f"gs://{bucket_name}/{file_name}"
        except Exception as e:
            logging.error(e)
            return None

    @staticmethod
    def upload(file_obj, data_source):
        file_name = file_obj.name
        file_type = file_name.split('.')[-1]
        dashboard = data_source.get('dashboard')
        hashed_name = Utils.md5_encode(f"{dashboard.id}")
        company_slug = dashboard.company.slug
        file_name = (
            f"{company_slug}/{dashboard.id}/{hashed_name}.{file_type}"
        )


        source_uri = GCS.upload_file_content(file_obj, file_name, os.getenv("BUCKET"))
        return source_uri

    @staticmethod
    def delete_blob(blob_name, bucket_name):
        """Deletes a blob from the bucket."""
        try:
            storage_client = storage.Client()

            bucket = storage_client.bucket(bucket_name)
            blob = bucket.blob(blob_name)
            blob.delete()

            logging.info("Blob {} deleted.".format(blob_name))
            return True
        except Exception as error:
            logging.error(error)
            return False


class Utils:

    @staticmethod
    def sha256_encode(string: str) -> str:
        """
        Convert `string` input to its SHA256 hash

        :param string: String that will be converted to a hash
        :return: Hash of `string` input
        """
        return hashlib.sha256(string.encode()).hexdigest()

    @staticmethod
    def md5_encode(string: str) -> str:
        """
        Convert `string` input to its MD5 hash

        :param string: String that will be converted to a hash
        :return: Hash of `string` input
        """
        return hashlib.md5(string.encode()).hexdigest()

    @staticmethod
    def get_random_number():
        return f"{randint(999, 9999)}"

    @staticmethod
    def read_google_sheet(sheet_url):
        gc = gspread.service_account(filename="service-account-key.json")
        sh = gc.open_by_url(sheet_url)
        records = pd.DataFrame(
            sh.get_worksheet(0).get_all_records()
        )
        return records


class Firestore:
    def __init__(self, project_id, collection):
        self._db = firestore.Client(project=project_id)
        self._collection = collection

    def add_document(self, doc_id, document):
        doc_ref = self._db.collection(self._collection).document(doc_id)
        doc_ref.set(document)

    def read_collection(self, field_name="id", _id=""):
        content = []
        users_ref = self._db.collection(self._collection)
        docs = users_ref.where(field_name, "==", str(_id)).stream()

        for doc in docs:
            content.append(doc.to_dict())
        return content


class GoogleSheet:

    @staticmethod
    def export_file(source_uri, dashboard):
        try:
            if source_uri:
                df = Utils.read_google_sheet(source_uri)
                hashed_name = Utils.md5_encode(source_uri)
                company_slug = dashboard.company.slug
                file_name = (
                    f"{company_slug}/{dashboard.id}/GS_{hashed_name}."
                    f"{DataSource.SourceTypes.CSV.lower()}"
                )
                source_uri = f"gs://{os.getenv('BUCKET')}/{file_name}"
                if DataSource.objects.filter(source_uri=source_uri).exists():
                    return "exist"
                return GCS.upload_content_simple(df.to_csv(), file_name, os.getenv("BUCKET"))
            return False
        except Exception as e:
            logging.error(e)
            return False
