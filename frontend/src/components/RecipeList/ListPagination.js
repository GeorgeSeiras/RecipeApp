import React from 'react'
import Pagination from 'react-bootstrap/Pagination'

export default function PaginationBar(props) {

    const disabled = (action) => {
        switch (action) {
            case 'previous':
                return props?.response?.previous!== undefined;
            case 'next':
                return props?.response?.next !== undefined;
            default:
                return false;
        }
    }
    return (
        <div>
            {props?.response &&
                <Pagination style={{
                    flex: '1',
                    paddingRight:'0'
                }}>
                    <Pagination.Prev
                        key={'prev'}
                        disabled={!disabled('previous')}
                        onClick={() => props.setClicked(-1)}
                        style={{ flex: '1',textAlign:'center' }}
                    />
                    <Pagination.Next
                        key={'next'}
                        disabled={!disabled('next')}
                        onClick={() => props.setClicked(1)}
                        style={{ flex: '1',textAlign:'center' }}
                    />
                </Pagination>
            }
        </div>
    )
}