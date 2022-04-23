import React, { useState, useEffect } from 'react'
import Pagination from 'react-bootstrap/Pagination'

export default function PaginationBar(props) {
    const [pageArr, setPageArr] = useState([]);


    useEffect(() => {
        setPageArr([])
        if (props?.totalPages) {
            var pageArr = []
            if (props.totalPages > 1) {
                if (props.totalPages <= 9) {
                    for (var i = 1; i <= props.totalPages; i++) {
                        pageArr.push(i);
                    }
                } else {
                    if (props.active <= 5) {
                        pageArr = [1, 2, 3, 4, 5, 6, 7, 8, "", props.totalPages];
                    } else if (props.totalPages - props.active <= 4) {
                        pageArr = [1, ""]
                        for (i = 7; i >= 0; i--) {
                            pageArr.push(props.totalPages - i)
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
                            props.totalPages
                        ];
                    }
                }
                setPageArr(pageArr)
            }else{
                setPageArr([1])
            }
        }
    }, [ props?.active, props?.totalPages])

    return (
        <div>
            {props?.totalPages &&
                <Pagination style={{
                    margin: 'auto',
                    justifyContent: 'center'
                }}>
                    {pageArr.map((element, index) => {
                        const toReturn = [];
                        if (index === 0) {
                            toReturn.push(
                                <Pagination.First
                                    key={'first'}
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