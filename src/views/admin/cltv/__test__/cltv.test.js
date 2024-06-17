/* eslint-disable testing-library/prefer-presence-queries */
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useNavigate } from "react-router-dom";
import CLTV from "../index";
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

describe("CLTV", () => {
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
            actions: {
                toggleColorMode: jest.fn(),
            },
        });
        render(<CLTV />);

        expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("renders CLTV dashboard when transformedData is available", () => {
        useApp.mockReturnValue({
            states: {
                transformedData: data,
                selectedYear: '2019',
                selectedDashboard: {
                    "id": 17,
                    "name": "CLTV",
                    "dashboard": 13,
                },
                colorMode: "dark",
            },
            actions: {
                toggleColorMode: jest.fn(),
            },
        });
        render(<CLTV />);

        expect(screen.getByText("Number Of Purchases Per Customer")).toBeInTheDocument();
        expect(screen.queryByText("Average Order Value")).toBeInTheDocument();
        expect(screen.queryByText("Customer Lifetime Value")).toBeInTheDocument();
        expect(screen.queryByText("Highest Grossing Product")).toBeInTheDocument();
        expect(screen.queryByText("Highest Earnings Per Session")).toBeInTheDocument();
        expect(screen.queryByText("Conversion Rates Per Product")).toBeInTheDocument();
        expect(screen.queryByText("Products That Sell Well Together")).toBeInTheDocument();
        expect(screen.queryByText("Most Sold Product Bundles")).toBeInTheDocument();
    });

    it("updates selectedYear when button is clicked", () => {
        useApp.mockReturnValue({
            states: {
                transformedData: data,
                selectedYear: '2019',
                selectedDashboard: {
                    "id": 17,
                    "name": "CLTV",
                    "dashboard": 13,
                },
                colorMode: "dark",
            },
            actions: {
                toggleColorMode: jest.fn(),
                setNewOption: jest.fn(),
                setSelectedYear: jest.fn(),
            },
        });
        render(<CLTV />);
        userEvent.click(screen.getByRole('button', { name: '2019' }));
        expect(screen.getByText("Number Of Purchases Per Customer")).toBeInTheDocument();
        expect(screen.queryByText("Average Order Value")).toBeInTheDocument();
        expect(screen.queryByText("Customer Lifetime Value")).toBeInTheDocument();
        expect(screen.queryByText("Highest Grossing Product")).toBeInTheDocument();
        expect(screen.queryByText("Highest Earnings Per Session")).toBeInTheDocument();
        expect(screen.queryByText("Conversion Rates Per Product")).toBeInTheDocument();
        expect(screen.queryByText("Products That Sell Well Together")).toBeInTheDocument();
        expect(screen.queryByText("Most Sold Product Bundles")).toBeInTheDocument();

    });
});
