# Dashboard APIs

## Setup Locally
```
 python -m venv venv

 pip install -r requirements.txt

 python manage.py makemigrations

 python manage.py migrate

 python manage.py createsuperuser

 python manage.py runserver
```

## Endpoints for User

1. ### Authentication Endpoint
     `account/auth/` 
    - Method = POST
    - Body 
   ```
    { 
        "email": "", 
        "password": "" 
    }
   ```
    - Response
    ```
   {
      "refresh": "",
      "access": ""
   }
   ```
2. ### Refresh Token Endpoint
     `account/token/refresh/`
    - Method = POST
    - Body 
   ```
   { "refresh": "" }
   ```
    - Response
   ```
    { "access": "" }
   ```
   
3. ### User Registration Endpoint
     `account/register/`
    - Method = POST
    - Headers
   ```
   {
        "Authorization": "Bearer <ACCESS_TOKEN>"
   }
   ```
   - Body 
   ```
   { 
       "first_name": "", 
       "last_name": "", 
       "email": "", 
       "password": "", 
       "confirm_password": "", 
       "company_name": "",
   }
   ```
   - Response
   ```
   { "message": "" }
   ```
4. ### View Profile Endpoint
     `account/profile/`
    - Method = `GET`
    - Headers
    ```
   {
        "Authorization": "Bearer <ACCESS_TOKEN>"
   }
   ```
    - Response
   ```
    {
     "id": ,
     "email": "",
     "first_name": "",
     "last_name": ,
     "organization": ,
     "is_admin": 
    }
   ```
5. ### Update Profile Endpoint
     `account/profile/`
     - Method =`PATCH`
     - Headers
     ```
     {
        "Authorization": "Bearer <ACCESS_TOKEN>"
     }
     ```
     - Body
     ```
     { 
         "fields to update": "", 
         "fields to update": ""
      }
     ```
     - Response
     ```
     {
     "Updated field": "",
     "Updated field":"",
     }
     ```
6. ### Inactive User Endpoint
     `acount/profile/`
    - Method =`DELETE`
    - Headers
    ```
    {
       "Authorization": "Bearer <ACCESS_TOKEN>"
    }
   ```
    - Response
    ```
     {
      "message": ""
     }
    ```
7. ### Change Password Endpoint
     `account/profile/password/`
      - Method= `PATCH`
      - Headers
      ```
       {
          "Authorization": "Bearer <ACCESS_TOKEN>"
       }
     ```
      - Body
      ```
      { 
           "password": "", 
           "confirm_password": ""
        }
      ```
      - Response
      ```
       {
       "message": "Password updated sucessfully"
       }
      ```
8. ### Users Dashboard View Endpoint
     `api/dashboards/users/`
     - Method= `GET`
     - Headers
     ```
      {
         "Authorization": "Bearer <ACCESS_TOKEN>"
      }
    ```
     - Response
     ```
     {
         "id":"",
         "name": "",
         "owner": "",
         "company": "",
         "created_at": "",
         "updated_at": ""
     }
     ```
9. ### Dashboard Details Endpoint
     `api/dashboards/details/`
      - Method=`GET`
      - Headers
      ```
       {
          "Authorization": "Bearer <ACCESS_TOKEN>"
       }
     ```
      - Response
      ```
      {
       "id": "",
       "name": "",
       "owner": "",
       "company": "",
       "created_at": "",
       "updated_at": ""
      }
     ```
10. ### Dashboard Datasource Endpoint
      `api/dashboards/datasource`
      - Method=`GET`
      - Headers
      ```
       {
          "Authorization": "Bearer <ACCESS_TOKEN>"
       }
     ```
      - Response
      ```
      {
        "id": "",
        "source_type": "",
        "dashboard": ",
        "source_uri": "",
        "processed_uri": "",
        "created_at": "",
        "updated_at": ""
      }
     ```  
11. ### Dashboard Share Endpoint
      `api/dashboards/share/`
      - Method = `POST`
      - Headers
      ```
      {
           "Authorization": "Bearer <ACCESS_TOKEN>"
      }
      ```
      - Body 
      ```
      { 
          "dashboard_id": "", 
          "role": "", 
          "user_id": "", 
          "company_id": "", 
      }
      ```
       - Response
       ```
       {
         "user": "",
         "dashboard": "",
         "public": bool,
         "company": "",
         "role": "",
         "share_key": "   
       }
       ```
12. ### View Shared Dashboard Endpoint
      `api/dashboards/view/share/`
      - Method= `GET`
      - Headers
      ```
       {
        "Authorization": "Bearer <ACCESS_TOKEN>"
       }
      ```
      - Response
      ```
       {
        "users": [
         {
           "id":""
         } 
        ],
        "others": [
         {
             "id": "",
             "user": "",
             "dashboard": "",
             "public": "",
             "company": "",
             "role": "",
             "share_key": ""
         }
        ]
       }
      ```
