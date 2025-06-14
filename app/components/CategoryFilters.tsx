import React, { memo } from "react";
import { Button } from "@/components/ui/button";

interface CategoryFiltersProps {
  categories: string[];
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
}

const CategoryFilters = memo(function CategoryFilters({
  categories,
  selectedCategory,
  setSelectedCategory,
}: CategoryFiltersProps) {
  return (
    <div className="mb-8 p-4 bg-card rounded-lg shadow-sm">
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => setSelectedCategory(null)}
          variant={selectedCategory === null ? "default" : "outline"}
          className="whitespace-nowrap"
        >
          All
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            onClick={() => setSelectedCategory(category)}
            variant={selectedCategory === category ? "default" : "outline"}
            className="whitespace-nowrap"
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
});

export default CategoryFilters;
