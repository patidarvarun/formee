import React from 'react'
import { Link } from 'react-router-dom'

const Pagination = ({ postPerPage, totalPost, paginate }) => {
    const pageNumber = [];
    for (let i = 1; i <= Math.ceil(totalPost / postPerPage); i++) {
        pageNumber.push(i)
    }
    return (
        <nav>
            <ul className='pagination'>
                {pageNumber.map((number) => (
                    <li key={number} className='page-item'>
                        <a onClick={() => paginate(number)} href='javascript:void(0)' className='page-link'>
                            {number}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    )
}

export default Pagination