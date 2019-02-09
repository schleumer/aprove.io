import gql from "graphql-tag";

export const viewFragment = gql`
  fragment ViewFragment on CustomersItem {
    id
    code
    name
    notes
    status
    type
    document
    phones {
      id
      position
      phone
    }
    emails {
      id
      position
      email
    }
  }
`;

export const viewQuery = gql`
  ${viewFragment}

  query($id: Long!) {
    result: customer(id: $id) {
      ...ViewFragment
    }
  }
`;

export const updateQuery = gql`
  ${viewFragment}

  mutation($input: UpdateCustomerInput!) {
    result: updateCustomer(input: $input) {
      ...ViewFragment
    }
  }
`;

export const createQuery = gql`
  ${viewFragment}

  mutation($input: CreateCustomerInput!) {
    result: createCustomer(input: $input) {
      ...ViewFragment
    }
  }
`;
