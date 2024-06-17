import Cookies from "js-cookie";
import { backendRoot } from "backendInfo";

const manager = {
  ///USERS
  signIn: (email, password) => {
    const form = new FormData();
    form.append("email", email);
    form.append("password", password);
    // console.log(email, password);
    return fetch(`${backendRoot}/account/auth/`, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: form,
    });
  },
  getProfile: () => {
    const token = Cookies.get("token");
    return fetch(`${backendRoot}/account/profile/`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
    });
  },
  updateProfile: (first_name,last_name) => {
    const token = Cookies.get("token");
    const form = new FormData();
    form.append("first_name",first_name);
    form.append("last_name",last_name);
    return fetch(`${backendRoot}/account/profile/`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
      body: form,
    });
  },
  deleteProfile: () => {
    const token = Cookies.get("token");
    return fetch(`${backendRoot}/account/profile/`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
    });
  },
  changePassword: (password,confirm_password) => {
    const form = new FormData();
    form.append("password", password);
    form.append("confirm_password", confirm_password);
    const token = Cookies.get("token");
    return fetch(`${backendRoot}/account/profile/password/`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
      body: form,
    });
  },

  getUserDashboards: () => {
    const token = Cookies.get("token");
    return fetch(`${backendRoot}/api/dashboards/users`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
    });
  },
  ///DASHBOARD
  getDashboardDetails: (dashboard_id) => {
    // console.log("THIS IS DASHBOARD ID",dashboard_id)
    const token = Cookies.get("token");
    return fetch(`${backendRoot}/api/dashboards/details/` + dashboard_id, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
    });
  },

  getDashboardDataSources: (dashboard_id) => {
    const token = Cookies.get("token");
    return fetch(
      `${backendRoot}/api/dashboards/` + dashboard_id + "/datasources/",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
  },

  shareDashboard: (formData) => {
    const token = Cookies.get("token");
    return fetch(`${backendRoot}/api/dashboards/share/`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
      body: formData,
    });
  },
  viewShares: (formData) => {
    //PENDING
    const token = Cookies.get("token");
    return fetch(`${backendRoot}/api/dashboards/share/`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
      body: formData,
    });
  },
  getCharts: (dashboard_id) => {
    const token = Cookies.get("token");
    return fetch(`${backendRoot}/api/dashboards/${dashboard_id}/charts/`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
    });
  },
  getMedia: (dashboard_id) => {
    const token = Cookies.get("token");
    return fetch(`${backendRoot}/api/dashboards/${dashboard_id}/media/`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
    });
  },

  getPublicAccessMetaData: (company_slug, share_id) => {
    return fetch(
      `${backendRoot}/api/company/${company_slug}/link/${share_id}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );
  },
  getPublicCharts: (dashboard_id) => {
    return fetch(
      `${backendRoot}/api/public/dashboards/${dashboard_id}/charts/`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );
  },
};

export default manager;