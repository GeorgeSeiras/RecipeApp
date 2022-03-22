import React from 'react';
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
        for (i = 1; i <= 5; i++) {
            if (i > props.rating && parseFloat(i) - 0.5 <= props.rating) {
                stars.push(
                    <Image
                        key={i}
                        style={{ width: '1.5em', height: 'auto' }}
                        src={STAR_HALF_YELLOW}
                        alt='empty'
                    />
                );
            } else if (i > props.rating) {
                stars.push(
                    <Image
                        key={i}
                        style={{ width: '1.5em', height: 'auto' }}
                        src={STAR_LINE_YELLOW}
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
            <Col style={{
                fontSize: props.size,
                display: 'flex',
                justifyContent: 'center',
                paddingTop: '0.2em'
            }}>
                {renderStars()}
                ({(() => {
                    if (props?.rating) {
                        return (parseFloat(props.rating).toFixed(1))
                    } else {
                        return (0)
                    }
                })()})
                votes: {props.votes || 0}
            </Col>
        </Container>
    )
}