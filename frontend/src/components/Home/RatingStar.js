import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container'
import Image from 'react-bootstrap/Image';
import STAR_HALF_YELLOW from '../../static/star_half_yellow.svg';
import STAR_LINE_YELLOW from '../../static/star_line_yellow.svg';
import STAR from '../../static/star.svg';

export default function RatingStars(props) {


    const renderStars = () => {
        const stars = []
        if (props.rating === null) {
            for (var i = 1; i <= 5; i++) {
                stars.push(
                    <Image
                        key={i}
                        style={{ width: '1.5em', height: 'auto' }}
                        src={STAR_LINE_YELLOW}
                        alt='empty'
                    />
                );
            }
            return stars
        }
        for (var i = 1; i <= 5; i++) {
            console.log(props.rating, i)
            if (i > props.rating) {
                stars.push(
                    <Image
                        key={i}
                        style={{ width: '1.5em', height: 'auto' }}
                        src={STAR_LINE_YELLOW}
                        alt='empty'
                    />
                );
            } else if (props.rating < i + 1) {
                stars.push(
                    <Image
                        key={i}
                        style={{ width: '1.5em', height: 'auto' }}
                        src={STAR_HALF_YELLOW}
                        alt='half'
                    />
                );
            } else {
                stars.push(
                    <Image
                        key={i}
                        style={{ width: '1.5em', height: 'auto' }}
                        src={STAR}
                        alt='full'
                    />
                );
            }
        }
        return stars
    }

    return (
        <Container>
            <Row>
                <Col>
                    {renderStars()}

                </Col>
            </Row>
        </Container>
    )
}