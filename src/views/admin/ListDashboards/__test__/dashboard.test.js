import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ListDashboard from "../index";
import { useApp } from "AppContext/AppProvider";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: jest.fn(),
}));

jest.mock("AppContext/AppProvider", () => ({
    useApp: jest.fn(),
}));

describe("ListDashboard", () => {
    beforeEach(() => {
        useNavigate.mockClear();
        jest.clearAllMocks();
    });

    it("renders the dashboard list", () => {
        useApp.mockReturnValue({
            states: {
                userDashboards: [
                    {
                        "id": 7,
                        "name": "Moda in Pelle",
                        "owner": "haseeb.shaik@transform.london",
                        "company": "Moda in Pelle",
                        "created_at": "2023-03-20T14:53:34.413331Z",
                        "updated_at": "2023-03-20T14:53:34.413357Z",
                        "pages": [
                            {
                                "id": 9,
                                "name": "Performance",
                                "dashboard": 7,
                                "created_at": "2023-03-20T14:53:45.793641Z",
                                "updated_at": "2023-03-20T14:53:45.793667Z"
                            },
                            {
                                "id": 10,
                                "name": "Technical",
                                "dashboard": 7,
                                "created_at": "2023-03-20T14:53:55.240669Z",
                                "updated_at": "2023-03-20T14:53:55.240694Z"
                            }
                        ]
                    },
                    {
                        "id": 8,
                        "name": "Loads of Stone",
                        "owner": "haseeb.shaik@transform.london",
                        "company": "Loads of Stone",
                        "created_at": "2023-03-20T14:54:41.054382Z",
                        "updated_at": "2023-03-20T14:54:41.054407Z",
                        "pages": [
                            {
                                "id": 11,
                                "name": "Performance",
                                "dashboard": 8,
                                "created_at": "2023-03-20T14:54:51.385255Z",
                                "updated_at": "2023-03-20T14:54:51.385281Z"
                            }
                        ]
                    },
                    {
                        "id": 9,
                        "name": "Wave Spas",
                        "owner": "haseeb.shaik@transform.london",
                        "company": "Wave Spas",
                        "created_at": "2023-03-20T14:55:14.054628Z",
                        "updated_at": "2023-03-20T14:55:14.054662Z",
                        "pages": [
                            {
                                "id": 12,
                                "name": "Performance",
                                "dashboard": 9,
                                "created_at": "2023-03-20T14:55:28.067602Z",
                                "updated_at": "2023-03-20T14:55:28.067627Z"
                            }
                        ]
                    },
                    {
                        "id": 13,
                        "name": "Demo CLTV",
                        "owner": "haseeb.shaik@transform.london",
                        "company": "Demo CLTV",
                        "created_at": "2023-05-05T11:09:24.454772Z",
                        "updated_at": "2023-05-05T11:09:24.454793Z",
                        "pages": [
                            {
                                "id": 17,
                                "name": "CLTV",
                                "dashboard": 13,
                                "created_at": "2023-05-05T11:09:37.989013Z",
                                "updated_at": "2023-05-05T11:09:37.989131Z"
                            }
                        ]
                    }
                ],
                colorMode: "dark",
            },
            actions: {
                toggleColorMode: jest.fn(),
            },
        });

        jest.spyOn(console, "error").mockImplementation(() => { });

        render(
            <Router>
                <ListDashboard />
            </Router>
        );

        expect(console.error).not.toHaveBeenCalled();

    });

    it("navigates to the selected dashboard on button click", () => {
        useNavigate.mockImplementationOnce(() => jest.fn());
        useApp.mockReturnValue({
            states: {
                userDashboards: [
                    {
                        "id": 7,
                        "name": "Moda in Pelle",
                        "owner": "haseeb.shaik@transform.london",
                        "company": "Moda in Pelle",
                        "created_at": "2023-03-20T14:53:34.413331Z",
                        "updated_at": "2023-03-20T14:53:34.413357Z",
                        "pages": [
                            {
                                "id": 9,
                                "name": "Performance",
                                "dashboard": 7,
                                "created_at": "2023-03-20T14:53:45.793641Z",
                                "updated_at": "2023-03-20T14:53:45.793667Z"
                            },
                            {
                                "id": 10,
                                "name": "Technical",
                                "dashboard": 7,
                                "created_at": "2023-03-20T14:53:55.240669Z",
                                "updated_at": "2023-03-20T14:53:55.240694Z"
                            }
                        ]
                    },
                    {
                        "id": 8,
                        "name": "Loads of Stone",
                        "owner": "haseeb.shaik@transform.london",
                        "company": "Loads of Stone",
                        "created_at": "2023-03-20T14:54:41.054382Z",
                        "updated_at": "2023-03-20T14:54:41.054407Z",
                        "pages": [
                            {
                                "id": 11,
                                "name": "Performance",
                                "dashboard": 8,
                                "created_at": "2023-03-20T14:54:51.385255Z",
                                "updated_at": "2023-03-20T14:54:51.385281Z"
                            }
                        ]
                    },
                    {
                        "id": 9,
                        "name": "Wave Spas",
                        "owner": "haseeb.shaik@transform.london",
                        "company": "Wave Spas",
                        "created_at": "2023-03-20T14:55:14.054628Z",
                        "updated_at": "2023-03-20T14:55:14.054662Z",
                        "pages": [
                            {
                                "id": 12,
                                "name": "Performance",
                                "dashboard": 9,
                                "created_at": "2023-03-20T14:55:28.067602Z",
                                "updated_at": "2023-03-20T14:55:28.067627Z"
                            }
                        ]
                    },
                    {
                        "id": 13,
                        "name": "Demo CLTV",
                        "owner": "haseeb.shaik@transform.london",
                        "company": "Demo CLTV",
                        "created_at": "2023-05-05T11:09:24.454772Z",
                        "updated_at": "2023-05-05T11:09:24.454793Z",
                        "pages": [
                            {
                                "id": 17,
                                "name": "CLTV",
                                "dashboard": 13,
                                "created_at": "2023-05-05T11:09:37.989013Z",
                                "updated_at": "2023-05-05T11:09:37.989131Z"
                            }
                        ]
                    }
                ],
                colorMode: "dark",
            },
            actions: {
                toggleColorMode: jest.fn(),
            },
        });
        render(
            <Router>
                <ListDashboard />
            </Router>
        );

        // TODO: Check mostly dashboards are they available or not 
        fireEvent.click(screen.getByText("Demo CLTV"));
        fireEvent.click(screen.getByText("Moda in Pelle"));
        fireEvent.click(screen.getByText("Loads of Stone"));
        fireEvent.click(screen.getByText("Wave Spas"));
    });
});
