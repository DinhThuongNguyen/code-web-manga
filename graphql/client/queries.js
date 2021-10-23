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

const GET_CHUONG_TRUYEN = gql`
  query queriesgetOneChuong($namevn: String, $halpId: String) {
    getOneChuong(namevn: $namevn, halpId: $halpId) {
      truyen {
        tentruyen
      }
      chuongTruyen {
        name
        images
      }
    }
  }
`;

export { GET_ALL_THE_LOAI, GET_CONTENT_FOR_HEADER, GET_CHUONG_TRUYEN };
