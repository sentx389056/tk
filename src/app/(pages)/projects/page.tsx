"use client";
import ProjectCard from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

type Project = {
   id: number;
   title: string;
   description: string;
   startDate: Date;
   endDate: Date;
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   fileUrl?: any;
}

type PaginatedResponse = {
   projects: Project[];
   total: number;
   page: number;
   pageSize: number;
   totalPages: number;
};

export default function ProjectsPage() {
   const nationalStandards = [
      {
         id: 1,
         code: "ГОСТ 2639-76",
         title: "Кинопроекторы для 35- и 70-мм фильмов. Типы. Основные параметры. Технические требования",
      },
      {
         id: 2,
         code: "ГОСТ 3840-79",
         title: "Объективы кинопроекционные. Технические условия",
      },
      {
         id: 3,
         code: "ГОСТ 6850-76",
         title: "Кинопроекторы для 16-мм фильмов. Типы. Основные параметры. Технические требования",
      },
      {
         id: 4,
         code: "ГОСТ 8910-75",
         title: "Приборы для измерения длины киноленты. Расчетные шаги перфорации. Передаточные числа",
      },
      {
         id: 5,
         code: "ГОСТ 9039-73",
         title: "Насадки анаформные для кинопроекционных объективов. Технические условия",
      },
      {
         id: 6,
         code: "ГОСТ 9040-81",
         title: "Блоки анаформных кинопроекционных объективов для съемки 35-мм широкоэкранных фильмов. Общие технические условия",
      },
      {
         id: 7,
         code: "ГОСТ 11079-76",
         title: "Фильмы изображения кинопроекционные контрольные. Типы. Основные параметры и размеры",
      },
      {
         id: 8,
         code: "ГОСТ 13137-82",
         title: "Аппараты киноскопировальные для контактной печати 70-, 35- и 16-мм кинофильмов. Экспонируемые поля. Размеры и расположение. Методы контроля",
      },
      {
         id: 9,
         code: "ГОСТ 17706-83",
         title: "Кинопроекторы и киносчитыватели для 70-, 35- и 16-мм кинофильмов. Размеры и расположение проецируемых полей. Методы контроля",
      },
      {
         id: 10,
         code: "ГОСТ 17813-90",
         title: "Кинопроекторы профессиональной кинематографии. Методы испытаний",
      },
      {
         id: 11,
         code: "ГОСТ 19869-74",
         title: "Фонограммы магнитные на 35-мм перфорированной ленте. Размеры и расположение дорожек записи и магнитных головок. Технические требования",
      },
      {
         id: 12,
         code: "ГОСТ 21998-76",
         title: "Фильмы контрольные звуковые 35- и 16-м с фотографической записью. Типы. Основные параметры и размеры",
      },
      {
         id: 13,
         code: "ГОСТ 23848-79",
         title: "Кинопроекторы для 16-, 35- и 70-мм фильмов. Маркировка, упаковка, транспортирование и хранение",
      },
      {
         id: 14,
         code: "ГОСТ 24229-80",
         title: "Аппараты киносьемочные 70-, 35- и 16-мм. Экспонируемые поля. Размеры и расположение. Методы контроля",
      },
      {
         id: 15,
         code: "ГОСТ 25704-83",
         title: "Материалы фильмов. Поля изображения и дорожки записи. Магнитные дорожки. Размеры и расположение. Методы контроля",
      },
      {
         id: 16,
         code: "ГОСТ 26018-83",
         title: "Аппараты киноскопировальные для оптической печати 70-, 35- и 16-мм кинофильмов. Размеры и расположение просвечиваемых и экспонируемых полей, методы контроля",
      },
      {
         id: 17,
         code: "ГОСТ 26157-84",
         title: "Объективы киносъемочные. Общие технические условия",
      },
      {
         id: 18,
         code: "ГОСТ Р 51103-2011",
         title: "Кинематография. Аппаратура и оборудование профессионального кинематографа. Требования безопасности и методы испытаний",
      },
   ];

   const internationalStandards = [
      {
         id: 1,
         code: "ISO 26433:2009",
         title: "Digital cinema (D-cinema) — XML data types",
         ics: "35.040.40\n37.060.99",
      },
      {
         id: 2,
         code: "ISO 26432-2:2008",
         title: "Digital source processing — Part 2: Digital cinema (D-cinema) low frequency effects (LFE) channel audio characteristics",
         ics: "37.060.99",
      },
      {
         id: 3,
         code: "ISO 26431-1:2008",
         title: "Digital cinema (D-cinema) quality — Part 1: Screen luminance level, chromaticity and uniformity",
         ics: "37.060.99",
      },
      {
         id: 4,
         code: "ISO 26430-9:2009",
         title: "Digital cinema (D-cinema) operations — Part 9: Key delivery bundle",
         ics: "35.040.40\n37.060.99",
      },
      {
         id: 5,
         code: "ISO 26430-6:2009",
         title: "Digital cinema (D-cinema) operations — Part 6: Auditorium security messages for intra-theater communications",
         ics: "35.040.40\n37.060.99",
      },
      {
         id: 6,
         code: "ISO 26430-5:2009",
         title: "Digital cinema (D-cinema) operations — Part 5: Security log event class and constraints",
         ics: "35.040.40\n37.060.99",
      },
      {
         id: 7,
         code: "ISO 26430-4:2009",
         title: "Digital cinema (D-cinema) operations — Part 4: Log record format specification",
         ics: "35.040.40\n37.060.99",
      },
      {
         id: 8,
         code: "ISO 26430-3:2008",
         title: "Digital cinema (D-cinema) operations — Part 3: Generic extra-theater message format",
         ics: "35.040.40\n37.060.99",
      },
      {
         id: 9,
         code: "ISO 26430-2:2008",
         title: "Digital cinema (D-cinema) operations — Part 2: Digital certificate",
         ics: "35.040.40\n37.060.99",
      },
      {
         id: 10,
         code: "ISO 26430-1:2008",
         title: "Digital cinema (D-cinema) operations — Part 1: Key delivery message",
         ics: "35.040.40\n37.060.99",
      },
      {
         id: 11,
         code: "ISO 26429-10:2009",
         title: "Digital cinema (D-cinema) packaging — Part 10: Stereoscopic picture track file",
         ics: "35.040.40\n37.060.99",
      },
      {
         id: 12,
         code: "ISO 26429-9:2009",
         title: "Digital cinema (D-cinema) packaging — Part 9: Asset mapping and file segmentation",
         ics: "35.040.40\n37.060.99",
      },
      {
         id: 13,
         code: "ISO 26429-8:2009",
         title: "Digital cinema (D-cinema) packaging — Part 8: Packing list",
         ics: "35.040.40\n37.060.99",
      },
      {
         id: 14,
         code: "ISO 26429-7:2008",
         title: "Digital cinema (D-cinema) packaging — Part 7: Composition playlist",
         ics: "35.040.40\n37.060.99",
      },
      {
         id: 15,
         code: "ISO 26429-6:2008",
         title: "Digital cinema (D-cinema) packaging — Part 6: MXF track file essence encryption",
         ics: "35.040.40\n37.060.99",
      },
      {
         id: 16,
         code: "ISO 26429-4:2008",
         title: "Digital cinema (D-cinema) packaging — Part 4: MXF JPEG 2000 application",
         ics: "35.040.40\n37.060.99",
      },
      {
         id: 17,
         code: "ISO 26429-3:2008",
         title: "Digital cinema (D-cinema) packaging — Part 3: Sound and picture track file",
         ics: "35.040.40\n37.060.99",
      },
      {
         id: 18,
         code: "ISO 26428-19:2011",
         title: "Digital cinema (D-cinema) distribution master — Part 19: Serial digital interface signal formatting for additional frame rates level AFR2 and level AFR4",
         ics: "35.040.40\n37.060.99",
      },
      {
         id: 19,
         code: "ISO 26428-11:2011",
         title: "Digital cinema (D-cinema) distribution master — Part 11: Additional frame rates",
         ics: "35.040.40\n37.060.99",
      },
      {
         id: 20,
         code: "ISO 26428-9:2009",
         title: "Digital cinema (D-cinema) distribution master — Part 9: Image pixel structure level 3 — Serial digital interface signal formatting",
         ics: "35.040.40\n37.060.99",
      },
      {
         id: 21,
         code: "ISO 26428-2:2008",
         title: "Digital cinema (D-cinema) distribution master — Part 2: Audio characteristics",
         ics: "35.040.40\n37.060.99",
      },
      {
         id: 22,
         code: "ISO 26428-1:2008",
         title: "Digital cinema (D-cinema) distribution master — Part 1: Image characteristics",
         ics: "35.040.40\n37.060.99",
      },
      {
         id: 23,
         code: "ISO 22234:2005",
         title: "Cinematography — Relative and absolute sound pressure levels for motion-picture multi-channel sound systems — Measurement methods and levels applicable to analog photographic film audio, digital photographic film audio and D-cinema audio",
         ics: "37.060.20",
      },
      {
         id: 24,
         code: "ISO 21727:2016",
         title: "Cinematography — Method of measurement of perceived loudness of short duration motion-picture audio material",
         ics: "37.060.20",
      },
      {
         id: 25,
         code: "ISO 20859:2005",
         title: "Cinematography - Spectral response of photographic audio reproducers for analog dye sound tracks on 35 mm film",
         ics: "37.060.20",
      },
      {
         id: 26,
         code: "ISO 17332:2001",
         title: "Cinematography — Manufacturer-printed latent image identification information for 35 mm motion-picture colour print film — Specifications",
         ics: "37.060.20",
      },
      {
         id: 27,
         code: "ISO 17266:2018",
         title: "Cinematography — Multichannel analogue and digital photographic sound and control records on 35 mm motion-picture prints and negatives, and digital soundtrack records on 70 mm motion-picture prints and negatives — Position and width dimensions",
         ics: "37.060.20",
      },
      {
         id: 28,
         code: "ISO 12612:2016",
         title: "Cinematography — Interchange of post-production sprocket-based materials",
         ics: "37.060.20",
      },
      {
         id: 29,
         code: "ISO 12611:2004",
         title: "Cinematography — Audio head tones for use in international exchange of 35 mm analogue magnetic film masters — Specifications and location",
         ics: "37.060.20",
      },
      {
         id: 30,
         code: "ISO 12606:1997",
         title: "Cinematography — Care and preservation of magnetic audio recordings for motion pictures and television",
         ics: "37.060.20",
      },
      {
         id: 31,
         code: "ISO 12222:2017",
         title: "Cinematography — Manufacturer-printed, latent image identification on 16 mm, 35 mm and 65 mm motion-picture film — Specifications and dimensions",
         ics: "37.060.20",
      },
      {
         id: 32,
         code: "ISO 10356:1996",
         title: "Cinematography — Storage and handling of nitrate-base motion-picture films",
         ics: "37.060.20",
      },
      {
         id: 33,
         code: "ISO 10284:1997",
         title: "Cinematography — Graphical symbols — Description",
         ics: "01.080.20\n37.060.01",
      },
      {
         id: 34,
         code: "ISO 9642:2020",
         title: "Cinematography — Time and control code for 24, 25 and 30 frames per second motion-picture film systems — Specifications",
         ics: "37.060.10",
      },
      {
         id: 35,
         code: "ISO 9568:1993",
         title: "Cinematography — Background acoustic noise levels in theatres, review rooms and dubbing rooms",
         ics: "17.140.20\n37.060.99",
      },
      {
         id: 36,
         code: "ISO 9525:1988",
         title: "Cinematography — Recording head gaps for two sound records on 17,5 mm magnetic film — Positions and width dimensions",
         ics: "37.060.20",
      },
      {
         id: 37,
         code: "ISO 8758:1992",
         title: "Cinematography — Photographic control and data records on 16 mm and 35 mm motion-picture film and prints — Dimensions and location",
         ics: "37.060.20",
      },
      {
         id: 38,
         code: "ISO 8687:1987",
         title: "Cinematography — Signal-to-noise ratio of 8 mm Type S, 16 mm and 35 mm variable-area photographic sound records — Method of measurement",
         ics: "37.060.20",
      },
      {
         id: 39,
         code: "ISO 8622:1998",
         title: "Cinematography — Magnetic sound records on 70 mm motion-picture release prints with magnetic stripes — A-chain reproduction characteristics",
         ics: "37.060.20",
      },
      {
         id: 40,
         code: "ISO 8590:1994",
         title: "Cinematography — Audio records on 70 mm motion-picture release prints with magnetic stripes — Recorded characteristic",
         ics: "37.060.20",
      },
      {
         id: 41,
         code: "ISO 8567:2002/Cor 1:2004",
         title: "Cinematography — Maximum permissible area for subtitle on 35 mm and 16 mm motion-picture release prints — Position and dimensions — Technical Corrigendum 1",
         ics: "37.060.20",
      },
      {
         id: 42,
         code: "ISO 8567:2002",
         title: "Cinematography — Maximum permissible area for subtitle on 35 mm and 16 mm motion-picture release prints — Position and dimensions",
         ics: "37.060.20",
      },
      {
         id: 43,
         code: "ISO 8400:1985",
         title: "Cinematography — Position of emulsion surface of 16 mm motion-picture prints — Identification",
         ics: "37.060.20",
      },
      {
         id: 44,
         code: "ISO 8395:1995",
         title: "Cinematography — Test films for the reproduction of 70 mm motion-picture release prints with magnetic stripes — Specifications",
         ics: "37.060.20",
      },
      {
         id: 45,
         code: "ISO 8001:1984",
         title: "Cinematography — Underexposed motion-picture film requiring forced development — Designation method",
         ics: "37.060.20",
      },
      {
         id: 46,
         code: "ISO 7832:2014",
         title: "Cinematography — Photoelectric output factor of photographic-type audio-level test films — Measurement and calibration",
         ics: "37.060.20",
      },
      {
         id: 47,
         code: "ISO 7831:1986",
         title: "Cinematography — A-chain frequency response for reproduction of 35 mm photographic sound — Reproduction characteristics",
         ics: "37.060.20",
      },
      {
         id: 48,
         code: "ISO 7739:2016",
         title: "Cinematography — Two-track photographic analogue sound records on 16 mm motion-picture prints — Positions and width dimensions",
         ics: "37.060.20",
      },
      {
         id: 49,
         code: "ISO 7343:1993",
         title: "Cinematography — Two-track photographic sound records on 35 mm motion-picture prints — Positions and width dimensions",
         ics: "37.060.20",
      },
      {
         id: 50,
         code: "ISO 6896:1984",
         title: "Cinematography — Intermittent sprockets for 35 mm motion-picture projectors — Dimensions",
         ics: "37.060.10",
      },
      {
         id: 51,
         code: "ISO 6038:1993",
         title: "Cinematography — Splices for use on 70 mm, 65 mm, 35 mm and 16 mm motion-picture films — Dimensions and locations",
         ics: "37.060.20",
      },
      {
         id: 52,
         code: "ISO 6036:1996",
         title: "Cinematography — Colour motion-picture prints and slides for television — Density specifications",
         ics: "37.060.20",
      },
      {
         id: 53,
         code: "ISO 6035:1983",
         title: "Cinematography — Viewing conditions for the evaluation of films and slides for television — Colours, luminances and dimensions",
         ics: "37.060.20",
      },
      {
         id: 54,
         code: "ISO 6033:1983",
         title: "Cinematography — Projection reel size 7 for 8 mm Type S motion-picture film — Dimensions and specifications",
         ics: "37.060.10",
      },
      {
         id: 55,
         code: "ISO 6025:2000",
         title: "Cinematography — Analogue photographic test films, 35 mm and 16 mm — Specifications",
         ics: "37.060.20",
      },
      {
         id: 56,
         code: "ISO 5926:2023",
         title: "Technical requirements and test methods for digital cinema stereoscopic projection",
         ics: "37.060.99",
      },
      {
         id: 57,
         code: "ISO 5768:1998",
         title: "Cinematography — Image produced by camera aperture Type W on 16 mm motion-picture film — Position and dimensions",
         ics: "37.060.20",
      },
      {
         id: 58,
         code: "ISO 5758:2002",
         title: "Cinematography — Labelling of containers for motion-picture film and magnetic material — Minimum information for exchange of materials",
         ics: "37.060.20",
      },
      {
         id: 59,
         code: "ISO 4834:1997",
         title: "Cinematography — Magnetic sound test films excluding striped release prints — Basic technical characteristics",
         ics: "37.060.20",
      },
      {
         id: 60,
         code: "ISO 4246:1994",
         title: "Cinematography — Vocabulary",
         ics: "01.040.37\n37.060.01",
      },
      {
         id: 61,
         code: "ISO 4243:1979",
         title: "Cinematography — Picture image area and photographic sound record on 16 mm motion-picture release prints — Positions and dimensions",
         ics: "37.060.20",
      },
      {
         id: 62,
         code: "ISO 4242:1980",
         title: "Cinematography — Recording head gaps for two sound records on 16 mm magnetic film — Positions and width dimensions",
         ics: "37.060.20",
      },
      {
         id: 63,
         code: "ISO 4241:2019",
         title: "Cinematography — Projection film leader (time-based), trailer and cue marks — Specifications",
         ics: "37.060.20",
      },
      {
         id: 64,
         code: "ISO 4238:1976",
         title: "Cinematography — Optical printing ratios for enlargement and reduction of motion-picture film images — Specifications",
         ics: "37.060.20",
      },
      {
         id: 65,
         code: "ISO 3820:1978",
         title: "Cinematography — Sprockets for 8 mm Type S motion-picture film — Dimensions and design",
         ics: "37.060.10",
      },
      {
         id: 66,
         code: "ISO 3774:1988",
         title: "Cinematography — 35 mm motion-picture film perforated 8 mm Type S (1-3-5-7-0) and (1-0) — Cutting and perforating dimensions",
         ics: "37.060.20",
      },
      {
         id: 67,
         code: "ISO 3773:1983",
         title: "Cinematography — Tape splices for 8 mm Type S motion-picture film for projector use — Dimensions",
         ics: "37.060.20",
      },
      {
         id: 68,
         code: "ISO 3653:1978",
         title: "Cinematography — Spindles for 8 mm Type S motion-picture projector reels/spools — Dimensions",
         ics: "37.060.10",
      },
      {
         id: 69,
         code: "ISO 3647:1976",
         title: "Cinematography — Spindles for 16 mm motion-picture camera spools and projector reels — Dimensions",
         ics: "37.060.20",
      },
      {
         id: 70,
         code: "ISO 3646:1976",
         title: "Cinematography — Motion-picture camera cartridge, 8 mm type S, model I — Camera run length, perforation cut-out and end-of-run notch in film — Specifications",
         ics: "37.060.20",
      },
      {
         id: 71,
         code: "ISO 3645:1984",
         title: "Cinematography — Image area produced by 8 mm Type S motion-picture camera aperture and maximum projectable image area — Positions and dimensions",
         ics: "37.060.20",
      },
      {
         id: 72,
         code: "ISO 3644:1976",
         title: "Cinematography — Spindles for 8 mm Type R motion-picture cameras and projectors — Dimensions",
         ics: "37.060.20",
      },
      {
         id: 73,
         code: "ISO 3642:1983",
         title: "Cinematography — Cemented or welded splices on 8 mm Type S motion-picture film for projector use — Dimensions",
         ics: "37.060.20",
      },
      {
         id: 74,
         code: "ISO 3641:1976",
         title: "Cinematography — Motion-picture camera cartridge, 8 mm Type S Model II — Cartridge fit and take-up core drive — Dimensions and specifications",
         ics: "37.060.20",
      },
      {
         id: 75,
         code: "ISO 3639:1981",
         title: "Cinematography — Projection reels/spools 75 to 312 mm diameter for 8 mm Type S motion-picture film — Dimensions and specifications",
         ics: "37.060.10",
      },
      {
         id: 76,
         code: "ISO 3047:1982",
         title: "Cinematography — Spool, daylight loading type, for 35 mm motion-picture cameras (capacity 30 m - 100 ft) — Dimensions",
         ics: "37.060.20",
      },
      {
         id: 77,
         code: "ISO 3042:1992/Cor 1:2004",
         title: "Cinematography — Labelling of containers for raw-stock motion-picture films and magnetic films — Minimum information specifications — Technical Corrigendum 1",
         ics: "37.060.20",
      },
      {
         id: 78,
         code: "ISO 3042:1992",
         title: "Cinematography — Labelling of containers for raw-stock motion-picture films and magnetic films — Minimum information specifications",
         ics: "37.060.20",
      },
      {
         id: 79,
         code: "ISO 3026:1992",
         title: "Cinematography — Printed 8 mm Type S image area on 35 mm motion-picture film perforated 8 mm Type S, 2R-4.227 (1664) or 5R-4.234 (1667) — Position and dimensions",
         ics: "37.060.20",
      },
      {
         id: 80,
         code: "ISO 3024:1983",
         title: "Cinematography — Motion-picture camera cartridge, 8 mm type S, model I — Camera run length, perforation cut-out and end-of-run notch in film — Specifications",
         ics: "37.060.20",
      },
      {
         id: 81,
         code: "ISO 3023:1995",
         title: "Cinematography — 65 mm and 70 mm unexposed motion-picture film — Cutting and perforating dimensions",
         ics: "37.060.20",
      },
      {
         id: 82,
         code: "ISO 3022:1988",
         title: "Cinematography — 35 mm motion-picture film perforated 16 mm (1-3-0) — Cutting and perforating dimensions",
         ics: "37.060.20",
      },
      {
         id: 83,
         code: "ISO 2969:2015",
         title: "Cinematography — B-chain electro-acoustic response of motion-picture control rooms and indoor theatres — Specifications and measurements",
         ics: "37.060.99",
      },
      {
         id: 84,
         code: "ISO 2939:2015",
         title: "Cinematography — Picture image area on 35 mm motion-picture release prints — Position and dimensions and analogue and digital photographic sound to picture record displacement",
         ics: "37.060.20",
      },
      {
         id: 85,
         code: "ISO 2910:2018",
         title: "Cinematography — Screen luminance and chrominance for the projection of film motion pictures",
         ics: "37.060.10",
      },
      {
         id: 86,
         code: "ISO 2907:2002",
         title: "Cinematography — Maximum projectable image area on 35 mm motion-picture film — Position and dimensions",
         ics: "37.060.20",
      },
      {
         id: 87,
         code: "ISO 2906:2002",
         title: "Cinematography — Image area produced by camera aperture on 35 mm motion-picture film — Position and dimensions",
         ics: "37.060.20",
      },
      {
         id: 88,
         code: "ISO 2467:2004",
         title: "Cinematography — Image area produced by 65 mm/5 perforation motion-picture camera aperture and maximum projectable image area on 70 mm/5 perforation motion-picture prints — Positions and dimensions",
         ics: "37.060.20",
      },
      {
         id: 89,
         code: "ISO 2404:1986",
         title: "Cinematography — Six-track magnetic sound records on 70 mm striped release prints — Locations and dimensions",
         ics: "37.060.20",
      },
      {
         id: 90,
         code: "ISO 1793:2005",
         title: "Cinematography — Reels for 16 mm motion-picture projectors (up to and including 610 m capacity: 38 cm size) — Dimensions",
         ics: "37.060.10",
      },
      {
         id: 91,
         code: "ISO 1787:1984",
         title: "Cinematography — Camera usage of 8 mm Type S motion-picture film — Specifications",
         ics: "37.060.10",
      },
      {
         id: 92,
         code: "ISO 1785:1983",
         title: "Cinematography — Printed 8 mm, Type S, image area on 16 mm motion-picture film perforated 8 mm, Type S (1-4) — Position and dimensions",
         ics: "37.060.20",
      },
      {
         id: 93,
         code: "ISO 1781:1983",
         title: "Cinematography — Projector usage of 8 mm Type S motion-picture film for direct front projection",
         ics: "37.060.10",
      },
      {
         id: 94,
         code: "ISO 1780:1984",
         title: "Cinematography — Motion-picture camera cartridge, 8 mm Type S Model I — Aperture, camera aperture profile, film position, pressure pad and pressure pad flatness — Dimensions and specifications",
         ics: "37.060.20",
      },
      {
         id: 95,
         code: "ISO 1700:1988",
         title: "Cinematography — 8 mm Type S motion-picture raw stock film — Cutting and perforating dimensions",
         ics: "37.060.20",
      },
      {
         id: 96,
         code: "ISO 1223:2003",
         title: "Cinematography — Picture areas for motion-picture films for television — Position and dimensions",
         ics: "37.060.20",
      },
      {
         id: 97,
         code: "ISO 1189:1986",
         title: "Cinematography — Recorded characteristic for magnetic sound records on 35 mm motion-picture film excluding striped release prints — Specifications",
         ics: "37.060.20",
      },
      {
         id: 98,
         code: "ISO 1188:1984",
         title: "Cinematography — Recorded characteristic for magnetic sound on full-coat 16 mm motion-picture film — Specifications",
         ics: "37.060.20",
      },
      {
         id: 99,
         code: "ISO 1039:1995",
         title: "Cinematography — Cores for motion-picture and magnetic film rolls — Dimensions",
         ics: "37.060.20",
      },
      {
         id: 100,
         code: "ISO 1019:1982",
         title: "Cinematography — Spools, daylight loading type for 16 mm motion-picture cameras — Dimensions",
         ics: "37.060.20",
      },
      {
         id: 101,
         code: "ISO 491:2002",
         title: "Cinematography — 35 mm motion-picture film and magnetic film — Cutting and perforating dimensions",
         ics: "37.060.20",
      },
      {
         id: 102,
         code: "ISO 490:1993",
         title: "Cinematography — Magnetic stripes and magnetic recording head gaps for sound record on 16 mm motion-picture film perforated along one edge (Type 1) — Positions and width dimensions",
         ics: "37.060.20",
      },
      {
         id: 103,
         code: "ISO 486:1988",
         title: "Cinematography — 16 mm motion-picture film perforated 8 mm Type R — Cutting and perforating dimensions",
         ics: "37.060.20",
      },
      {
         id: 104,
         code: "ISO 466:1976",
         title: "Cinematography — Image produced by 16 mm motion-picture camera aperture — Position and dimensions",
         ics: "37.060.20",
      },
      {
         id: 105,
         code: "ISO 359:1983",
         title: "Cinematography — Projectable image area on 16 mm motion-picture prints — Dimensions and location",
         ics: "37.060.20",
      },
      {
         id: 106,
         code: "ISO 162:1985",
         title: "Cinematography — Head gaps and sound records for three-, four-, or six-track magnetic sound records on 35 mm and single-track on 17,5 mm motion-picture film containing no picture — Positions and width dimensions",
         ics: "37.060.20",
      },
      {
         id: 107,
         code: "ISO 74:1976",
         title: "Cinematography — Image area produced by camera aperture and maximum projectable image area on 8 mm Type R motion-picture film — Positions and dimensions",
         ics: "37.060.20",
      },
      {
         id: 108,
         code: "ISO 71:2014",
         title: "Cinematography — 16 mm negative photographic sound record on 16 mm, 35/16 mm and 35/32 mm motion-picture film — Positions and dimensions",
         ics: "37.060.20",
      },
      {
         id: 109,
         code: "ISO 70:1981",
         title: "Cinematography — 35 mm negative photographic sound record on 35 mm motion-picture film — Position and maximum width dimensions",
         ics: "37.060.20",
      },
      {
         id: 110,
         code: "ISO 69:1998",
         title: "Cinematography — 16 mm motion-picture and magnetic film — Cutting and perforating dimensions",
         ics: "37.060.20",
      },
      {
         id: 111,
         code: "ISO 28:1976",
         title: "Cinematography — Camera usage of 8 mm Type R motion-picture film — Specifications",
         ics: "37.060.10",
      },
      {
         id: 112,
         code: "ISO 26:1993",
         title: "Cinematography — Projector usage of 16 mm motion-picture films for direct front projection — Specifications",
         ics: "37.060.10",
      },
      {
         id: 113,
         code: "ISO 25:1994",
         title: "Cinematography — Camera usage of 16 mm motion-picture film — Specifications",
         ics: "37.060.10",
      },
      {
         id: 114,
         code: "ISO 23:1993",
         title: "Cinematography — Camera usage of 35 mm motion-picture film — Specifications",
         ics: "37.060.10",
      },
   ];

   const [projects, setProjects] = useState<Project[]>([]);
   const [isLoading, setLoading] = useState<boolean>(true);
   const [search, setSearch] = useState<string>("");
   const [page, setPage] = useState(1);
   const [pageSize] = useState(10);
   const [totalPages, setTotalPages] = useState(1);
   const [total, setTotal] = useState(0);

   const fetchProjects = async () => {
      setLoading(true);
      try {
         const params = new URLSearchParams({
            page: page.toString(),
            pageSize: pageSize.toString()
         });
         
         if (search) {
            params.append('search', search);
         }

         const res = await fetch(`/api/projects?${params}`);
         if (!res.ok) {
            throw new Error('Failed to fetch projects');
         }
         const data: PaginatedResponse = await res.json();
         setProjects(data.projects);
         setTotal(data.total);
         setTotalPages(data.totalPages);
      } catch (error) {
         console.error('Error:', error);
         setProjects([]);
      } finally {
         setLoading(false);
      }
   };

   // Reset to first page when search changes
   useEffect(() => {
      setPage(1);
   }, [search]);

   // Fetch when page or search changes
   useEffect(() => {
      const t = setTimeout(() => {
         fetchProjects();
      }, 350);
      return () => clearTimeout(t);
   }, [page, search]);

   return (
      <main className="flex flex-col w-full px-5 xl:px-40 py-10">
         <div className="py-10">
            <div className="flex flex-col items-center">
               <h1 className="text-4xl font-bold text-center mb-2 max-sm:text-2xl">Перечни стандартов</h1>
               {/* <p className="text-center text-base font-light text-gray-700 max-w-180">Проекты национальных стандартов, разрабатываемые Техническим комитетом</p> */}
            </div>
            <div className="mt-10 flex flex-col items-center text-center gap-2">
               <h2 className="text-base font-semibold tracking-wide max-w-2xl text-gray-900">
                  ПЕРЕЧЕНЬ<br/>национальных стандартов Российской Федерации и межгосударственных стандартов,
                  действующих в Российской Федерации на национальном уровне и относящихся к компетенции<br/>ТК «Кинематография»
               </h2>
            </div>
            <section className="w-full mt-6 text-[9px] sm:text-[10px] md:text-xs">
               <div className="overflow-x-auto border border-gray-200 rounded-md">
                  <table className="w-full min-w-[720px] table-fixed border border-gray-300 border-collapse text-gray-900">

                     <colgroup>
                        <col className="w-12" />
                        <col className="w-[20%]" />
                        <col className="w-[68%]" />
                     </colgroup>
                     <thead className="bg-[#F2F4F7] text-[8px] sm:text-[8px] md:text-[10px] tracking-wide text-gray-700">

                        <tr>
                           <th className="px-3 py-3 text-center align-middle border border-gray-300 text-sm">№ п/п</th>
                           <th className="px-3 py-3 text-left align-middle border border-gray-300 text-sm">Обозначение</th>
                           <th className="px-3 py-3 text-left align-middle border border-gray-300 text-sm">Наименование</th>
                        </tr>
                     </thead>
                     <tbody>
                        {nationalStandards.map((standard, index) => (
                           <tr key={standard.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                              <td className="px-3 py-3 text-center align-top border border-gray-300 text-sm">{standard.id}</td>
                              <td className="px-3 py-3 align-top border border-gray-300 leading-snug break-words text-sm">{standard.code}</td>
                              <td className="px-3 py-3 align-top border border-gray-300 leading-snug break-words text-sm">{standard.title}</td>
                           </tr>
                        ))}
                     </tbody>

                  </table>
               </div>
            </section>
            <div className="mt-12 flex flex-col items-center text-center gap-2">
               <h2 className="text-base font-semibold tracking-wide max-w-3xl text-gray-900">
                  ПЕРЕЧЕНЬ<br/>международных стандартов (ИСО/ТК 36), относящихся к компетенции<br/>ТК «Кинематография»
               </h2>
            </div>
            <section className="w-full mt-6 text-[9px] sm:text-[10px] md:text-xs">
               <div className="overflow-x-auto border border-gray-200 rounded-md">
                  <table className="w-full min-w-[720px] table-fixed border border-gray-300 border-collapse text-gray-900">

                     <colgroup>
                        <col className="w-12" />
                        <col className="w-[22%]" />
                        <col className="w-[60%]" />
                        <col className="w-[16%]" />
                     </colgroup>
                     <thead className="bg-[#F2F4F7] text-[8px] sm:text-[8px] md:text-[10px] tracking-wide text-gray-700">

                        <tr>
                           <th className="px-3 py-3 text-center align-middle border border-gray-300 text-sm">№ п/п</th>
                           <th className="px-3 py-3 text-left align-middle border border-gray-300 text-sm">Обозначение</th>
                           <th className="px-3 py-3 text-left align-middle border border-gray-300 text-sm">Наименование</th>
                           <th className="px-3 py-3 text-center align-middle border border-gray-300 text-sm">Код ICS</th>
                        </tr>
                     </thead>
                     <tbody>
                        {internationalStandards.map((standard, index) => (
                           <tr key={standard.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                              <td className="px-3 py-3 text-center align-top border border-gray-300 text-sm">{standard.id}</td>
                              <td className="px-3 py-3 align-top border border-gray-300 leading-snug break-words text-sm">{standard.code}</td>
                              <td className="px-3 py-3 align-top border border-gray-300 leading-snug break-words text-sm">{standard.title}</td>
                              <td className="px-3 py-3 text-center align-top border border-gray-300 leading-snug whitespace-pre-line text-sm">{standard.ics}</td>
                           </tr>
                        ))}
                     </tbody>

                  </table>
               </div>
            </section>
            {/* <SearchInput value={search} onChange={setSearch} count={total} /> */}
            <section className="mt-8 flex flex-col gap-10">
               {isLoading ? (
                  <div className="flex flex-col gap-10">
                     <div className="flex flex-col space-y-3 border-1 rounded-xl p-5">
                        <Skeleton className="h-5 w-xl rounded-xl max-sm:w-xs" />
                        <div className="space-y-2">
                           <Skeleton className="h-4 w-[250px]" />
                           <Skeleton className="h-4 w-[200px]" />
                        </div>
                     </div>
                     <div className="flex flex-col space-y-3 border-1 rounded-xl p-5">
                        <Skeleton className="h-5 w-xl rounded-xl max-sm:w-xs" />
                        <div className="space-y-2">
                           <Skeleton className="h-4 w-[250px]" />
                           <Skeleton className="h-4 w-[200px]" />
                        </div>
                     </div>
                  </div>
               // ) : projects.length === 0 ? (
               //    <div className="text-center py-8 text-gray-500">
               //       Перечни стандартов не найдены
               //    </div>
               ) : (
                  <>
                     {projects.map((project) => (
                        <ProjectCard
                           key={project.id}
                           title={project.title}
                           description={project.description}
                           startDate={new Date(project.startDate)}
                           endDate={new Date(project.endDate)}
                           fileUrl={project.fileUrl}
                        />
                     ))}
                     {/* Pagination controls */}
                     {projects.length > 0 && (
                        <div className="flex items-center justify-between mt-4 pt-4 border-t">
                           <div className="text-sm text-gray-500">Страница {page} из {totalPages}</div>
                           <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1 || isLoading}>
                                 Предыдущая
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages || isLoading}>
                                 Следующая
                              </Button>
                           </div>
                        </div>
                     )}
                  </>
               )}
            </section>
         </div>
      </main>
   )
}