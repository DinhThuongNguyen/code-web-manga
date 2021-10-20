import { gql } from "@apollo/client";

const GET_ALL_THE_LOAI = gql`
  query getTheLoai {
    getTheLoai {
      id
      name
    }
  }
`;

const GET_CONTENT_FOR_HEADER = gql`
  query QueriesGetContentForHeader {
    getContentForHeader {
      truyen {
        id
        tentruyen
        avatar
      }
      TheLoai {
        name
        namekhongdau
      }
    }
  }
`;

export { GET_ALL_THE_LOAI, GET_CONTENT_FOR_HEADER };
