import React, { useState } from 'react';
import Select from 'react-select';

export const SearchableDropdown = ({ onSelect, dropdownProps }) => {
  const { options, dropdownNum, placeholders } = dropdownProps;
  const [selectedValues, setSelectedValues] = useState(Array(dropdownNum).fill(null));

  const handleValueChange = (index, value) => {
    const updatedValues = [...selectedValues];
    updatedValues[index] = value;
    setSelectedValues(updatedValues);
    onSelect(updatedValues); 
  };

  const gridColumns = Math.min(dropdownNum, 4);
  const gridClass = `grid grid-cols-${gridColumns} gap-5 mr-4`;

  const customStyles = {
    control: (styles) => ({
      ...styles,
      padding: '0px 12px',
      borderRadius: '0.3rem',
      borderColor: '#d1d5db',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#4CAF50',
      },
    }),
    menu: (styles) => ({
      ...styles,
      borderRadius: '0px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    }),
  };

  return (
    <div className={`${gridClass} w-full`}>
      {[...Array(Number(dropdownNum))].map((_, index) => (
        <div key={index} className="w-full">
          <Select
            options={options[index] || []}
            styles={customStyles}
            placeholder={placeholders[index] || `Select ${index + 1}...`}
            isSearchable={true}
            onChange={(value) => handleValueChange(index, value)}
          />
        </div>
      ))}
    </div>
  );
};
