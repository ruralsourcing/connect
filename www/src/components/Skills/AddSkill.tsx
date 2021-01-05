import { ApolloError, gql, useMutation, useQuery } from "@apollo/client";
import { Tech } from "@prisma/client";
import { Button, Form, Rate, Select } from "antd";
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

  const {
    data,
    loading,
    error,
  }: {
    data?: { technologies: Tech[] };
    loading: boolean;
    error?: ApolloError;
  } = useQuery(GET_TECH);


  const [addSkill] = useMutation(ADD_SKILL);

  return (
    (error && <div>{error.message}</div>) || (
      <Form
        onFinish={(data) => {
          if (!data.rating || !data.techId) return;
          addSkill({
            variables: {
              technologyId: parseInt(data.techId),
              rating: data.rating,
            },
          }).then((result) => {
            console.log(result);
            //refetch();
          });
        }}
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout="horizontal"
      >
        <Form.Item name="techId" label="Technology">
          <Select disabled={loading}>
            {!loading &&
              data &&
              data.technologies.map((t: Tech) => (
                <Select.Option key={t.id} value={t.id}>
                  {t.name}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item name="rating" label="Rating">
          <Rate count={10} defaultValue={5} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    )
  );
};

export default AddSkill;
