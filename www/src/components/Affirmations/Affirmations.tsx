import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import { User } from "@prisma/client";
import React from 'react';
import { useSnack } from "../../context/AlertContext/SnackBarProvider";

const GET_USERS = gql`
  {
    users {
      id
      email
    }
  }
`;

const SEND_AFFIRMATION = gql`
  mutation sendAffirmation($userId: ID!) {
    sendAffirmation(userId: $userId) {
        from
        to
    }
  }
`;

const AFFIRMATION_GIVEN_SUBSCRIPTION = gql`
  subscription {
    affirmationGiven {
        from
        to
    }
  }
`;

const Affirmations = () => {
  const { loading, error, data } = useQuery(GET_USERS);
  const [sendAffirmation] = useMutation(SEND_AFFIRMATION);

  useSubscription(AFFIRMATION_GIVEN_SUBSCRIPTION, {
    onSubscriptionData: ({ subscriptionData }) => {
      useSnack.updateMessage("Affirmation Given!!");
    },
  });

  return (
    (loading && <div>Loading...</div>) ||
    (error && <div>Error! ${error.message}`</div>) ||
    (data &&
      data.users.map((user: User) => {
        return (
          <>
            <button onClick={() => {
                sendAffirmation({
                    variables: {
                        userId: user.id
                    }
                })
            }}>Send</button>
            <div>{user.email}</div>
          </>
        );
      }))
  );
};

export default Affirmations;
