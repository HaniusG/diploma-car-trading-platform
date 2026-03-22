import logo from "./logo.svg";
import search_icon from "./search_icon.svg";
import mercedes_logo from "./mercedes_logo.svg";
import toyota_logo from "./toyota_logo.svg";
import tesla_logo from "./tesla_logo.svg";
import profile_img from "./profile_img.png";
import app_main_img from "./app_main_img.png";
import cross_icon from './cross_icon.svg';
import location_icon from './location_icon.svg';
import money_icon from './money_icon.svg';
import suitcase_icon from './suitcase_icon.svg';
import person_icon from './person_icon.svg';
import upload_area from './upload_area.svg';
import resume_selected from './resume_selected.svg';
import resume_not_selected from './resume_not_selected.svg';
import play_store from './play_store.svg';
import app_store from './app_store.svg';
import back_arrow_icon from './back_arrow_icon.svg';
import left_arrow_icon from './left_arrow_icon.svg';
import right_arrow_icon from './right_arrow_icon.svg';
import facebook_icon from './facebook_icon.svg'
import instagram_icon from './instagram_icon.svg'
import twitter_icon from './twitter_icon.svg'
import home_icon from './home_icon.svg'
import add_icon from './add_icon.svg'
import profile_upload_icon from './profile_upload_icon.svg'
import person_tick_icon from './person_tick_icon.svg'
import resume_download_icon from './resume_download_icon.svg'
import delete_icon from './delete_icon.svg'
import email_icon from './email_icon.svg'
import lock_icon from './lock_icon.svg'
import nissan_logo from './nissan_logo.png'
import byd_logo from './byd_logo.svg'
import honda_logo from './honda_logo.svg'

export const assets = {
    logo,
    search_icon,
    cross_icon,
    upload_area,
    resume_not_selected,
    resume_selected,
    mercedes_logo,
    toyota_logo,
    tesla_logo,
    app_main_img,
    play_store,
    app_store,
    back_arrow_icon,
    left_arrow_icon,
    right_arrow_icon,
    location_icon,
    money_icon,
    suitcase_icon,
    person_icon,
    facebook_icon,
    instagram_icon,
    twitter_icon,
    home_icon,
    add_icon,
    person_tick_icon,
    resume_download_icon,
    profile_img,
    delete_icon,
    profile_upload_icon,
    email_icon,
    lock_icon,
    nissan_logo,
    byd_logo,
    honda_logo
}

export const CarCategories = [
    "Sedan",
    "Hatchback",
    "SUV",
    "Van / Minivan",
    "Pickup truck",
    "Electric vehicle (EV)",
    "Hybrid car",
    "Motorcycle",
]

export const CarLocations = [
    "Yerevan",
    "Gyumri",
    "Vanadzor",
    "Kapan",
    "Exegnadzor",
    "Artashat",
    "Abovyan"
]

export const CarBrands = [
    "Abarth",
    "Acura",
    "Alfa Romeo",
    "Aston Martin",
    "Audi",
    "Bentley",
    "BMW",
    "Bugatti",
    "Buick",
    "BYD",
    "Cadillac",
    "Changan",
    "Chevrolet",
    "Chery",
    "Citroën",
    "Dacia",
    "Daewoo",
    "Daihatsu",
    "Dodge",
    "FAW",
    "Ferrari",
    "Fiat",
    "Fisker",
    "Ford",
    "Geely",
    "GMC",
    "Great Wall",
    "Haval",
    "Honda",
    "Hummer",
    "Hyundai",
    "Infiniti",
    "Isuzu",
    "Iveco",
    "Jaguar",
    "Jeep",
    "Kia",
    "Koenigsegg",
    "Lada",
    "Lamborghini",
    "Lancia",
    "Land Rover",
    "Lexus",
    "Lincoln",
    "Lotus",
    "Maserati",
    "Mazda",
    "McLaren",
    "Mercedes-Benz",
    "MG",
    "Mini",
    "Mitsubishi",
    "Nissan",
    "Opel",
    "Pagani",
    "Peugeot",
    "Porsche",
    "Renault",
    "Rivian",
    "Rolls-Royce",
    "Saab",
    "SEAT",
    "Skoda",
    "Smart",
    "SsangYong",
    "Subaru",
    "Suzuki",
    "Tesla",
    "Toyota",
    "Volkswagen",
    "Volvo",
    "Zotye",

    // EV / New Chinese oriented brands
    "Aion",
    "Aiways",
    "Arcfox",
    "BYTON",
    "Leapmotor",
    "Nio",
    "Ora",
    "Seres",
    "Zeekr",

    // Specialty / low-volume
    "Alpine",
    "Borgward",
    "Caterham",
    "Dodge SRT",
    "Ginetta",
    "Hennessey",
    "Lucid",
    "Mahindra",
    "Maruti Suzuki",
    "Roewe",
    "Scion",
    "Tata",
    "Vauxhall",
    "Wiesmann"
]

export const CarTransmissions = [
    "Automatic",
    "Manual",
]

export const CarFuelTypes = [
    "Petrol",
    "Diesel",
    "Hybrid",
    "Electric",
]

export const CarColors = [
    "Black",
    "White",
    "Silver",
    "Grey",
    "Blue",
    "Red",
    "Purple"
]

export const CarDrivetrains = [
    "FWD",
    "RWD",
    "AWD",
]

export const CarSteeringTypes = [
    "Left",
    "Right",
]

export const CarConditions = [
    "New",
    "Very good",
    "Good",
    "Needs Repair",
    "Damaged",
]

// Sample data for Manage Jobs Page
export const manageJobsData = [
    { _id: 1, title: "Full Stack Developer", date: 1729102298497, location: "Yerevan", applicants: 20 },
    { _id: 2, title: "Data Scientist", date: 1729102298497, location: "San Francisco", applicants: 15 },
    { _id: 3, title: "Marketing Manager", date: 1729102298497, location: "London", applicants: 2 },
    { _id: 4, title: "UI/UX Designer", date: 1729102298497, location: "Dubai", applicants: 25 }
];

// Sample data for Profile Page

export const viewApplicationsPageData = [
    { _id: 1, name: "Richard Sanford", jobTitle: "Full Stack Developer", location: "Yerevan", imgSrc: profile_img },
    { _id: 2, name: "Enrique Murphy", jobTitle: "Data Scientist", location: "San Francisco", imgSrc: profile_img },
    { _id: 3, name: "Alison Powell", jobTitle: "Marketing Manager", location: "London", imgSrc: profile_img },
    { _id: 4, name: "Richard Sanford", jobTitle: "UI/UX Designer", location: "Dubai", imgSrc: profile_img },
    { _id: 5, name: "Enrique Murphy", jobTitle: "Full Stack Developer", location: "Vanadzor", imgSrc: profile_img },
    { _id: 6, name: "Alison Powell", jobTitle: "Data Scientist", location: "New Delhi", imgSrc: profile_img },
    { _id: 7, name: "Richard Sanford", jobTitle: "Marketing Manager", location: "Artashat", imgSrc: profile_img },
];

