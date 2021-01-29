import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Slick from 'react-slick';
import { Global, Overlay, CloseBtn, SlickWrapper, ImgWrapper, Indicator } from './style';
import { backUrl } from '../../config/config';

const ImagesZoom = ({ images, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <Overlay>
      <Global />
      <SlickWrapper>
        <CloseBtn onClick={onClose} />
        <div>
          <Slick
            initialSlide={0}
            afterChange={(slide) => setCurrentSlide(slide)}
            infinite
            slidesToShow={1}
            slidesToScroll={1}
          >
            {images.map((image) => (
              <ImgWrapper key={image.src}>
                <img src={image.src} alt={image.src} />
                {/* <img src={`${backUrl}/${image.src}`} alt={image.src} /> */}
              </ImgWrapper>
            ))}
          </Slick>
          <Indicator>
            <div>
              {currentSlide + 1} / {images.length}
            </div>
          </Indicator>
        </div>
      </SlickWrapper>
    </Overlay>
  );
};

ImagesZoom.propTypes = {
  images: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ImagesZoom;
