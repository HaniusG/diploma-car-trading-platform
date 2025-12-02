import React from "react";
import { useNavigate } from "react-router-dom";

type Car = {
  id: number;
  title: string;
  category: string;
  location: string;
  price_usd: number;
  img: string;
};

type CarCardProps = {
  car: Car;
};

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  const navigate = useNavigate();

  return (
    <div className="border p-6 shadow rounded">
      <div className="flex justify-between items-center">
        <img className="h-20 rounded" src={car.img} alt={car.title} />
      </div>

      <h4 className="font-medium text-xl mt-2">{car.title}</h4>

      <div className="flex items-center gap-3 mt-2 text-xs">
        <span className="bg-blue-50 border border-blue-200 px-4 py-1.5 rounded">
          {car.location}
        </span>
        <span className="bg-red-50 border border-red-200 px-4 py-1.5 rounded">
          {car.category}
        </span>
      </div>

      <p className="text-gray-500 text-sm mt-4">
        Price: <span className="font-semibold">${car.price_usd}</span>
      </p>

      <div className="mt-4 flex gap-4 text-sm">
        <button
          onClick={() => {
            navigate(`/car/${car.id}`);
            scrollTo(0, 0);
          }}
          className="bg-blue-600 hover:bg-blue-700 duration-200 cursor-pointer text-white px-4 py-2 rounded"
        >
          Buy Now
        </button>

        <button
          onClick={() => {
            navigate(`/car/${car.id}`);
            scrollTo(0, 0);
          }}
          className="text-gray-500 border border-gray-500 rounded px-4 py-2 cursor-pointer"
        >
          See details
        </button>
      </div>
    </div>
  );
};

export default CarCard;