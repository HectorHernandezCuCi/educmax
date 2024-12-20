"use client";
import Image from "next/image";
import React, { useRef, useEffect, useState } from "react";

import teacher1 from "@/img/smiling-young-female-teacher-standing-front-blackboard-holding-stranded-board-showing-thumb-up-classroom.jpg";
import teacher2 from "@/img/portrait-teacher-female-holding-book.jpg";
import students from "@/img/students-knowing-right-answer.jpg";
import { HeaderPrincipal } from "@/components/header/headerPrincipal";
import calendarIcon from "@/img/calendarIcon.svg";
import schoolIcon from "@/img/schoolIcon.svg";
import shareIcon from "@/img/shareIcon.svg";
import resourceIcon from "@/img/resoruceIcon.svg";
import { useRouter } from "next/navigation";

export default function Home() {
  const imagesRef = useRef < HTMLDivElement >(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  const scrollToImages = () => {
    imagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (imagesRef.current) {
        const offsetTop = imagesRef.current.offsetTop;
        setIsScrolled(window.scrollY >= offsetTop - 100); // Cambia el umbral si es necesario
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="m-0">
      {/* Video de fondo */}
      <div className="relative min-h-screen pt-32 overflow-hidden">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/videoBg.mp4" type="video/mp4" />
          Tu navegador no soporta videos HTML5.
        </video>

        {/* Contenido superpuesto */}
        <div className="relative z-10 h-screen flex flex-col gap-10 justify-center items-center">
          <div>
            <h1 className="text-bold text-3xl font-bold text-white text-center">
              El mejor lugar para guardar y compartir tus recursos como maestro
            </h1>
          </div>
          <div className="flex gap-5">
            <button className="overflow-hidden relative w-32 p-2 h-12 bg-black text-white border-none rounded-md text-xl font-bold cursor-pointer relative z-10 group">
              Inicia
              <span className="absolute w-36 h-32 -top-8 -left-2 bg-white rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-500 duration-1000 origin-left"></span>
              <span className="absolute w-36 h-32 -top-8 -left-2 bg-yellowMain rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-700 duration-700 origin-left"></span>
              <span className="absolute w-36 h-32 -top-8 -left-2 bg-yellowMain rotate-12 transform scale-x-0 group-hover:scale-x-50 transition-transform group-hover:duration-1000 duration-500 origin-left"></span>
              <span className="group-hover:opacity-100 group-hover:duration-1000 duration-100 opacity-0 absolute top-2.5 left-6 z-10 text-center">
                Ahora
              </span>
            </button>
            <button
              className="overflow-hidden relative w-32 p-2 h-12 bg-black text-white border-none rounded-md text-xl font-bold cursor-pointer relative z-10 group"
              onClick={scrollToImages}
            >
              Descubre
              <span className="absolute w-36 h-32 -top-8 -left-2 bg-white rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-500 duration-1000 origin-left"></span>
              <span className="absolute w-36 h-32 -top-8 -left-2 bg-yellowMain rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-700 duration-700 origin-left"></span>
              <span className="absolute w-36 h-32 -top-8 -left-2 bg-yellowMain rotate-12 transform scale-x-0 group-hover:scale-x-50 transition-transform group-hover:duration-1000 duration-500 origin-left"></span>
              <span className="group-hover:opacity-100 group-hover:duration-1000 duration-100 opacity-0 absolute top-2.5 left-6 z-10 text-center">
                Mas
              </span>
            </button>
          </div>
        </div>
      </div>
      {/* 3 Columns */}
      <div
        ref={imagesRef}
        className="bg-greenBG flex items-center justify-center gap-10 p-8"
      >
        <div className="w-60 h-[360px] overflow-hidden rounded-full shadow-lg">
          <Image
            src={teacher2}
            alt="Teacher 2"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-60 h-[360px] overflow-hidden rounded-full shadow-lg transform -translate-y-16">
          <Image
            src={students}
            alt="Students"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-60 h-[360px] overflow-hidden rounded-full shadow-lg">
          <Image
            src={teacher1}
            alt="Teacher 1"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      {/* New */}
      <div className="grid grid-cols-3 items-center justify-center gap-5 p-5">
        {/* Share*/}
        <div className="flex gap-3 flex-col justify-center items-center text-center">
          <div>
            <Image src={shareIcon} alt="Calendar Icon" className="w-20 h-20" />
          </div>
          <div>
            <h1 className="font-bold text-1xl">Foros de Colaboración</h1>
            <p className="text-start">
              Un área para que los maestros se conecten con colegas, compartan
              ideas, pidan consejos, y trabajen juntos en proyectos educativos,
              fortaleciendo el intercambio de conocimientos.
            </p>
          </div>
        </div>
        {/* School*/}
        <div className="flex gap-3 flex-col justify-center items-center text-center">
          <div>
            <Image src={schoolIcon} alt="Calendar Icon" className="w-20 h-20" />
          </div>
          <div>
            <h1 className="font-bold text-1xl">
              Organización de Grupos de Clase
            </h1>
            <p className="text-start">
              Herramientas mejoradas para gestionar grupos de estudiantes: crear
              listas, asignar tareas personalizadas, y llevar un seguimiento del
              progreso individual o grupal con reportes automatizados.
            </p>
          </div>
        </div>
        {/* Resoruce*/}
        <div className="flex gap-3 flex-col justify-center items-center text-center">
          <div>
            <Image
              src={resourceIcon}
              alt="Calendar Icon"
              className="w-20 h-20"
            />
          </div>
          <div>
            <h1 className="font-bold text-1xl">
              Repositorio de Recursos Compartidos
            </h1>
            <p className="text-start">
              Un espacio donde los maestros pueden subir, descargar y descubrir
              recursos educativos como planificaciones, guías de estudio,
              actividades interactivas y más. Además, podrán buscar por nivel
              educativo, materia o tema específico.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
