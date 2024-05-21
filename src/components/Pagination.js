import React, { useState, useEffect } from "react";

const Pagination = ({ length, itemsPerPage, list, onPageChange }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(length / itemsPerPage);

    useEffect(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        onPageChange(list.slice(startIndex, endIndex));
    }, [currentPage, itemsPerPage, list, onPageChange]);

    const handleNext = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const handlePrev = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(Math.max(1, Math.min(pageNumber, totalPages)));
    };

    const renderPaginationNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(
                    <span key={i}
                        onClick={() => handlePageChange(i)}
                        className={currentPage === i ? "btn-pagination pagination-active" : "btn-pagination"}
                    >
                        {i}
                    </span>
            );
        }
        return pageNumbers;
    };

    return (
        <div className="pagination">
            <svg
                onClick={handlePrev}
                disabled={currentPage === 1}
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
            >
                <circle cx="15.417" cy="15" r="14.5" fill="#FFAE00" />
                <path
                    d="M12.3429 14.8475C12.3429 14.4758 12.4995 14.1041 12.8069 13.8226L16.5885 10.3602C16.7567 10.2062 17.0351 10.2062 17.2033 10.3602C17.3715 10.5142 17.3715 10.7691 17.2033 10.9231L13.4217 14.3855C13.1433 14.6404 13.1433 15.0546 13.4217 15.3095L17.2033 18.7719C17.3715 18.9259 17.3715 19.1808 17.2033 19.3348C17.0351 19.4888 16.7567 19.4888 16.5885 19.3348L12.8069 15.8724C12.4995 15.591 12.3429 15.2192 12.3429 14.8475Z"
                    fill="black"
                />
            </svg>
            {renderPaginationNumbers()}
            <svg
                onClick={handleNext}
                disabled={currentPage === totalPages}
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="29"
                viewBox="0 0 30 29"
                fill="none"
            >
                <circle cx="15.417" cy="14.5" r="14.5" fill="#FFAE00" />
                <path
                    d="M17.911 15.7975C17.911 16.1692 17.7544 16.541 17.447 16.8224L13.6654 20.2848C13.4972 20.4388 13.2188 20.4388 13.0506 20.2848C12.8824 20.1308 12.8824 19.8759 13.0506 19.7219L16.8322 16.2595C17.1106 16.0046 17.1106 15.5904 16.8322 15.3355L13.0506 11.8731C12.8824 11.7191 12.8824 11.4642 13.0506 11.3102C13.2188 11.1562 13.4972 11.1562 13.6654 11.3102L17.447 14.7726C17.7544 15.0541 17.911 15.4258 17.911 15.7975Z"
                    fill="black"
                />
            </svg>
        </div>
    );
};

export default Pagination;
