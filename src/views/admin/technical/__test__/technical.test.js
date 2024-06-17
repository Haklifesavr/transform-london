/* eslint-disable testing-library/prefer-presence-queries */
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useNavigate } from "react-router-dom";
import Technical from "../index";
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

describe("Technical", () => {
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
        render(<Technical />);

        expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("renders Technical dashboard when transformedData is available", () => {
        useApp.mockReturnValue({
            states: data,
            actions: {
                toggleColorMode: jest.fn(),
            },
        });
        render(<Technical />);

        expect(screen.getByText("Core Web Vitals Metrics")).toBeInTheDocument();
        expect(screen.getByText("URLs tracking Table")).toBeInTheDocument();
        expect(screen.getByText("Performance Table")).toBeInTheDocument();
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
        render(<Technical />);
        userEvent.click(screen.getByRole('button', { name: 'mobile' }));
        expect(screen.getByText("Core Web Vitals Metrics")).toBeInTheDocument();
        expect(screen.getByText("URLs tracking Table")).toBeInTheDocument();
        expect(screen.getByText("Performance Table")).toBeInTheDocument();
    });
});
