import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import { useSnacks } from "../../context/AlertContext/SnackBarProvider";

const GET_SKILLS = gql`
  {
    user {
      skills {
        id
        technology {
          name
        }
        rating
      }
    }
  }
`;

const SKILL_ADDED_SUBSCRIPTION = gql`
  subscription {
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

const SKILL_DELETED_SUBSCRIPTION = gql`
  subscription {
    skillDeleted
  }
`;

const MEETING_CREATED_SUBSCRIPTION = gql`
  subscription {
    meetingStarted {
      start_url
      join_url
    }
  }
`;

const DELETE_SKILL = gql`
  mutation deleteSkill($skillId: ID!) {
    deleteSkill(skillId: $skillId)
  }
`;

const Skills = () => {
  const { loading, error, data, refetch } = useQuery(GET_SKILLS);

  const [deleteSkill] = useMutation(DELETE_SKILL);

  const snacks = useSnacks();

  useSubscription(SKILL_ADDED_SUBSCRIPTION, {
    onSubscriptionData: ({ subscriptionData }) => {
      snacks.updateMessage("Skill Added!!");
      refetch();
    },
  });

  useSubscription(MEETING_CREATED_SUBSCRIPTION, {
    onSubscriptionData: ({ subscriptionData }) => {
      snacks.updateMessage("Meeting Created!!");
    },
  });

  useSubscription(SKILL_DELETED_SUBSCRIPTION, {
    onSubscriptionData: ({ subscriptionData }) => {
      snacks.updateMessage("Skill Deleted!!");
      refetch();
    },
  });

  return (
    (loading && <div>Loading...</div>) ||
    (error && <div>Error! ${error.message}`</div>) ||
    (data &&
      data.user &&
      data.user.skills.map(
        (
          skill: {
            id: string;
            rating: number;
            technology: {
              name: string;
            };
          },
          idx: string
        ) => (
          <div key={idx}>
            <button
              onClick={() => {
                console.log(skill);
                deleteSkill({
                  variables: {
                    skillId: skill.id,
                  },
                })
                  .then(() => refetch())
                  .catch((error) => {
                    console.log(error);
                    refetch();
                  });
              }}
            >
              DELETE
            </button>
            User Ranks <strong>{skill.technology?.name}</strong> with rating <strong>{skill.rating}</strong>
          </div>
        )
      ))
  );
};

export default Skills;
