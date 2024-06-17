/* eslint-disable testing-library/no-unnecessary-act */
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import SignIn from "../index.jsx";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { useApp } from "AppContext/AppProvider";
import manager from "helpers/manager";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: jest.fn(),
}));

jest.mock("AppContext/AppProvider", () => ({
    useApp: jest.fn(),
}));
jest.mock("helpers/manager");

describe("SignIn", () => {
    it("renders the Sign In form", () => {
        // Check if the Sign In form elements are rendered
        useApp.mockReturnValue({
            states: {
                colorMode: "dark",
            },
            actions: {
                toggleColorMode: jest.fn(),
            },
        });
        render(
            <MemoryRouter>
                <SignIn />
            </MemoryRouter>
        );
        expect(screen.getByPlaceholderText("example@mail.com")).toBeTruthy();
        expect(screen.getByPlaceholderText("Min. 8 characters")).toBeTruthy();
        const signInButtons = screen.getAllByText("Sign In");
        expect(signInButtons.length).toBeGreaterThan(0);
    });

    it("submits the form with valid credentials", async () => {
        const signInMock = jest.fn().mockResolvedValueOnce(
            new Response(JSON.stringify({ access: "token" }), {
                status: 200,
                headers: { "Content-type": "application/json" },
            })
        );
        manager.signIn = signInMock;

        const navigateMock = jest.fn();
        useNavigate.mockReturnValue(navigateMock);

        useApp.mockReturnValue({
            states: {
                colorMode: "dark",
            },
            actions: {
                toggleColorMode: jest.fn(),
            },
        });
        render(
            <MemoryRouter>
                <SignIn />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText("example@mail.com"), {
            target: { value: "haseeb.shaik@transform.london" },
        });
        fireEvent.change(screen.getByPlaceholderText("Min. 8 characters"), {
            target: { value: "g67L7z0%KMqG" },
        });

        await act(async () => {
            fireEvent.submit(screen.getByTestId("signin-form")); // Submit the form
        });

        expect(signInMock).toHaveBeenCalledWith(
            "haseeb.shaik@transform.london",
            "g67L7z0%KMqG"
        );
        expect(document.cookie).toContain("token=token");
        expect(navigateMock).toHaveBeenCalledWith("/admin");
    });


    // it("displays an error message for unsuccessful sign-in", async () => {
    //     // Mock the necessary functions and API calls to simulate unsuccessful sign-in
    //     const signInMock = jest.fn().mockRejectedValueOnce({ error: "Invalid credentials" });
    //     manager.signIn = signInMock;

    //     useApp.mockReturnValue({
    //         states: {
    //             colorMode: "dark",
    //         },
    //         actions: {
    //             toggleColorMode: jest.fn(),
    //         },
    //     });

    //     const navigateMock = jest.fn();
    //     useNavigate.mockReturnValue(navigateMock);
    //     render(
    //         <MemoryRouter>
    //             <SignIn />
    //         </MemoryRouter>
    //     );

    //     // Fill in the form inputs
    //     fireEvent.change(screen.getByPlaceholderText("example@mail.com"), {
    //         target: { value: "hasee8448k@transform.london" },
    //     });
    //     fireEvent.change(screen.getByPlaceholderText("Min. 8 characters"), {
    //         target: { value: "545454545nbMqG" },
    //     });

    //     await act(async () => {
    //         fireEvent.submit(screen.getByTestId("signin-form")); // Submit the form
    //     });

    //     // Wait for the error message to be displayed
    //     const errorMessage = await screen.findByText("Sorry, we messed up");

    //     // Check if the error message is displayed
    //     expect(signInMock).toHaveBeenCalledWith("hasee8448k@transform.london", "545454545nbMqG%KMqG");
    //     expect(navigateMock).toHaveBeenCalledWith("/admin");
    //     expect(errorMessage).toBeInTheDocument();
    // });

});
