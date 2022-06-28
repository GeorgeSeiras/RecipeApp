import React, { useState, useEffect } from 'react'
import Pagination from 'react-bootstrap/Pagination'

export default function PaginationBar(props) {
    const [pageArr, setPageArr] = useState([]);
    const [totalPages, setTotalPages] = useState();
    useEffect(() => {
        setPageArr([])
        setTotalPages(props?.response?.total_pages);
        if (props?.response) {
            var pageArr = []
            if (totalPages > 1) {
                if (totalPages <= 9) {
                    for (var i = 1; i <= totalPages; i++) {
                        pageArr.push(i);
                    }
                } else {
                    if (props.active <= 5) {
                        pageArr = [1, 2, 3, 4, 5, 6, 7, 8, "", totalPages];
                    } else if (totalPages - props.active <= 4) {
                        pageArr = [1, ""]
                        for (i = 7; i >= 0; i--) {
                            pageArr.push(totalPages - i)
                        }
                    } else {
                        pageArr = [
                            1,
                            "",
                            props.active - 3,
                            props.active - 2,
                            props.active - 1,
                            props.active,
                            props.active + 1,
                            props.active + 2,
                            props.active + 3,
                            "",
                            totalPages
                        ];
                    }
                }
                setPageArr(pageArr)
            }else{
                setPageArr([1])
            }
        }
    }, [props?.response, props.active, totalPages])

    return (
        <div>
            {props?.response &&
                <Pagination style={{
                    margin: 'auto',
                    justifyContent: 'center'
                }}>
                    {pageArr.map((element, index) => {
                        const toReturn = [];
                        if (index === 0) {
                            toReturn.push(
                                <Pagination.First
                                    key={'fisrt'}
                                    onClick={
                                        props.active === 1 ? () => { } : () => { props.setPageClicked(1) }
                                    }
                                />
                            );

                            toReturn.push(
                                <Pagination.Prev
                                    key={'prev'}
                                    onClick={
                                        props.active === 1 ? () => { } : () => { props.setPageClicked(props.active - 1) }
                                    }
                                />
                            );
                        }
                        if (element === "") {
                            toReturn.push(<Pagination.Ellipsis key={index} />)
                        } else {
                            toReturn.push(
                                <Pagination.Item
                                    key={index}
                                    active={props.active === element ? true : false}
                                    onClick={
                                        props.active === element
                                            ? () => { }
                                            : () => { props.setPageClicked(element) }
                                    }
                                >
                                    {element}
                                </Pagination.Item>
                            );
                            if (index === pageArr.length - 1) {
                                toReturn.push(
                                    <Pagination.Next
                                        key={'next'}
                                        onClick={
                                            props.active === element
                                                ? () => { }
                                                : () => { props.setPageClicked(props.active + 1) }
                                        }
                                    />
                                );

                                toReturn.push(
                                    <Pagination.Last
                                        key={'last'}
                                        onClick={
                                            props.active === element
                                                ? () => { }
                                                : () => { props.setPageClicked(element) }
                                        }
                                    />
                                );
                            }
                        }
                        return toReturn;
                    })}
                </Pagination>
            }
        </div>
    )
}