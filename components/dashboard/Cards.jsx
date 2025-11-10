import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cardData } from '@/data';

const Cards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4 px-2 relative z-20 ">
      {cardData.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className={`${card.bgColor} border-0 shadow-sm`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-800 flex items-center justify-between w-full">
                <h1>{card.title}</h1>
                <Icon className="h-4 w-4 text-gray-800" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">
                {card.value}
              </div>
              <p className="text-xs text-gray-700 mt-1">
                {card.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default Cards;