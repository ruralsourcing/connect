import { gql, useQuery, useSubscription } from "@apollo/client";

const GET_SKILLS = gql`
  {
    skills {
      technology {
        name
      }
      rating
    }
  }
`;

const SKILLS_SUBSCRIPTION = gql`
  subscription skillAdded {
    skillAdded {
        id
        userId
        rating
        Tech {
            id
            name
        }
    }
  }
`;

const Skills = () => {
  const { loading, error, data, refetch } = useQuery(GET_SKILLS);

  useSubscription(SKILLS_SUBSCRIPTION, {
      onSubscriptionData: ({subscriptionData}) => {
        console.log('[SUBSCRIPTION DATA]', subscriptionData.data);
        refetch();
      }
  });

  return (
    (loading && <div>Loading...</div>) ||
    (error && <div>Error! ${error.message}`</div>) ||
    (data &&
      data.skills.map(
        (
          skill: {
            rating: number;
            technology: {
              name: string;
            };
          },
          idx: string
        ) => (
          <div key={idx}>
            User Skill {skill.technology?.name} with rating {skill.rating}
          </div>
        )
      ))
  );
};

export default Skills;
