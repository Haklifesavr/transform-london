/* eslint-disable testing-library/prefer-presence-queries */
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useNavigate } from "react-router-dom";
import Performance from "../index";
import { useApp } from "AppContext/AppProvider";
import data from './data.json';
import "@testing-library/jest-dom/extend-expect";

class ResizeObserver {
    observe() { }
    unobserve() { }
}

global.ResizeObserver = ResizeObserver;

// Mock getScreenCTM function to prevent the error in ApexCharts
SVGElement.prototype.getScreenCTM = jest.fn();

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: jest.fn(),
}));

jest.mock("AppContext/AppProvider", () => ({
    useApp: jest.fn(),
}));

describe("Performance", () => {
    beforeEach(() => {
        useNavigate.mockClear();
        jest.clearAllMocks();
    });

   
    it("renders loading spinner when transformedData is null", () => {
        useApp.mockReturnValue({
            states: {
                transformedData: null,
                colorMode: "dark",
            },
            actions:  {
                toggleColorMode: jest.fn(),
                setNewOption: jest.fn(),
                setSelectedYear: jest.fn(),
            },
        });
        render(<Performance />);

        expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("renders Performance dashboard when transformedData is available", () => {
        useApp.mockReturnValue({
            states: data,
            actions:  {
                toggleColorMode: jest.fn(),
                setNewOption: jest.fn(),
                setSelectedYear: jest.fn(),
            },
        });
        render(<Performance />);

        expect(screen.getByText("Total Engaged Sessions 2023")).toBeInTheDocument();
        expect(screen.getByText("Bounce Rate 2023")).toBeInTheDocument();
        expect(screen.getByText("Landing Page 2023")).toBeInTheDocument();
        expect(screen.getByText("Total Engaged Sessions by Country")).toBeInTheDocument();
        expect(screen.getByText("New Users 2023")).toBeInTheDocument();
    });

    it("updates selectedYear when button is clicked", () => {
        useApp.mockReturnValue({
            states: data,
            actions: {
                toggleColorMode: jest.fn(),
                setNewOption: jest.fn(),
                setSelectedYear: jest.fn(),
            },
        });
        render(<Performance />);
        userEvent.click(screen.getByRole('button', { name: '2022' }));
        expect(screen.getByText(/Total Engaged Sessions \d+/)).toBeInTheDocument();
        expect(screen.getByText(/Bounce Rate \d+/)).toBeInTheDocument();
        expect(screen.getByText(/Landing Page \d+/)).toBeInTheDocument();
        expect(screen.getByText("Total Engaged Sessions by Country")).toBeInTheDocument();
        expect(screen.getByText(/New Users \d+/)).toBeInTheDocument();
    });
});
