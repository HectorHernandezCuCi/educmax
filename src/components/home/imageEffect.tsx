import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import teacher1 from "@HectorHernandes /src/img/smiling-young-female-teacher-standing-front-blackboard-holding-stranded-board-showing-thumb-up-classroom.jpg";
import teacher2 from "@HectorHernandes /src/img/portrait-teacher-female-holding-book.jpg";
import students from "@HectorHernandes /src/img/students-knowing-right-answer.jpg";

const ImageEffect = () => {
  const [inView, setInView] = useState(false);

  const imageRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.5 }
    );
    if (imageRef.current) {
      observer.observe(imageRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-greenBG flex items-center justify-center gap-10 p-8">
      <div
        ref={imageRef}
        className={`w-60 h-[360px] overflow-hidden rounded-full shadow-lg transform transition-all duration-1000 ${
          inView ? 'scale-105 opacity-100' : 'scale-95 opacity-50'
        }`}
      >
        <Image
          src={teacher2}
          alt="Teacher 2"
          className="w-full h-full object-cover"
        />
      </div>
      <div
        className={`w-60 h-[360px] overflow-hidden rounded-full shadow-lg transform -translate-y-16 transition-all duration-1000 ${
          inView ? 'scale-105 opacity-100' : 'scale-95 opacity-50'
        }`}
      >
        <Image
          src={students}
          alt="Students"
          className="w-full h-full object-cover"
        />
      </div>
      <div
        className={`w-60 h-[360px] overflow-hidden rounded-full shadow-lg transform transition-all duration-1000 ${
          inView ? 'scale-105 opacity-100' : 'scale-95 opacity-50'
        }`}
      >
        <Image
          src={teacher1}
          alt="Teacher 1"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default ImageEffect;
