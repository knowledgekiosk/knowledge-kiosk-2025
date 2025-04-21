import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { PublicFileCard } from "./PublicFileCard";
import { useEffect, useState } from 'react';
import useAxiosPublic from '../Custom/useAxiosPublic';

function chunkArray(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export const PublicFilesSlider = () => {
    const [files, setFiles] = useState([]);
    const axiosPublic = useAxiosPublic();
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await axiosPublic.get('/pdfPublicCollection');
          setFiles(res.data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchData();
    }, [axiosPublic]);
  
    const chunks = chunkArray(files, 6);
  
    return (
      <Swiper
        // Swiper config ...
        modules={[Navigation, Pagination, Mousewheel, Keyboard]}
        spaceBetween={50}
      slidesPerView={3}
      navigation
      pagination={{ clickable: true }}
      scrollbar={{ draggable: true }}
      onSwiper={(swiper) => console.log(swiper)}
      onSlideChange={() => console.log('slide change')}
      >
        {chunks.map((chunk, index) => (
          <SwiperSlide key={index}>
            {chunk.map(file => (
              <PublicFileCard key={file._id} file={file} />
            ))}
          </SwiperSlide>
        ))}
      </Swiper>
    );
  };
  

