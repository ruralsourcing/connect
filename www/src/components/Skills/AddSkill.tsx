import { ApolloError, gql, useMutation, useQuery } from "@apollo/client";
import { Tech } from "@prisma/client";
import { Autocomplete } from '@material-ui/lab';
import { TextField, Slider } from '@material-ui/core';
import React from "react";

const ADD_SKILL = gql`
  mutation addSkill($technologyId: Int!, $rating: Int!) {
    addSkill(skill: { technologyId: $technologyId, rating: $rating }) {
      id
      rating
      Tech {
        id
        name
      }
    }
  }
`;

const GET_TECH = gql`
  {
    technologies {
      id
      name
    }
  }
`;

const AddSkill = () => {

  const [tech, updateTech] = React.useState(0);
  const [rating, updateRating] = React.useState(5);

  const handleRatingChange = (event: React.ChangeEvent<{}>, value:number|number[]) => {
    if(typeof(value) == 'number')
      updateRating(value);
  }

  const handleTechChange = (event: any, value:Tech|null) => {
    if(value)
      updateTech(parseInt(value.id.toString()));
    else
      updateTech(0);
  }

  const {
    data,
    loading,
    error,
  }: {
    data?: { technologies: Tech[] };
    loading: boolean;
    error?: ApolloError;
  } = useQuery(GET_TECH);

  const valuetext = (value:number) => {
    return `Skill Level at ${value}`;
  }

  const marks = [
    {
      value: 1,
      label: '1'
    },
    {
      value: 5,
      label: '5'
    },
    {
      value: 10,
      label: '10'
    }
  ];

  const handleSubmit = (data: any) => {
    data.preventDefault();
      if (tech === 0) return;
      addSkill({
        variables: {
          technologyId: tech,
          rating: rating,
        },
      })
  }

  const [addSkill] = useMutation(ADD_SKILL);

  return (
    (error && <div>{error.message}</div>) || (
      <form
        onSubmit={handleSubmit}
      >
          <Autocomplete
            id="technologies"
            onChange={handleTechChange}
            loading={loading}
            options={!loading && data ? data.technologies.map((t: Tech) => t) : []}
            getOptionLabel={(t:Tech) => t.name}
            renderInput={(params) => (
              <TextField {...params} label="Technologies" margin="normal" variant="outlined" />
            )}
          />
        
          <Slider
            value={rating}
            onChangeCommitted={handleRatingChange}
            getAriaValueText={valuetext}
            aria-labelledby="discrete-slider-custom"
            step={1}
            marks={marks}
            valueLabelDisplay="auto"
            max={10}
          />
        <button type="submit">
          Submit
        </button>
      </form>
    )
  );
};

export default AddSkill;
