import React, { memo } from "react";
import { Button } from "@/components/ui/button";
import { Filter, Grid } from "lucide-react";

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
    <section className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Filter className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">
              Explore by Category
            </h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Filter API endpoints by category to find exactly what you need
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="glass-effect p-6 rounded-xl border border-border/30">
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              onClick={() => setSelectedCategory(null)}
              variant={selectedCategory === null ? "default" : "outline"}
              className={`nature-button font-medium transition-all duration-200 ${
                selectedCategory === null
                  ? "nature-gradient text-white shadow-md"
                  : "border-border/50 hover:border-primary/30 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Grid className="h-4 w-4 mr-2" />
              All Categories
            </Button>
            
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? "default" : "outline"}
                className={`nature-button font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? "nature-gradient text-white shadow-md"
                    : "border-border/50 hover:border-primary/30 text-muted-foreground hover:text-foreground"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

export default CategoryFilters;
