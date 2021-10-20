import { gql } from "@apollo/client";

const REGISTER = gql`
  mutation RegisterMutation(
    $name: String!
    $email: String!
    $password: String
    $role: String
    $avatar: String
  ) {
    register(
      name: $name
      email: $email
      password: $password
      role: $role
      avatar: $avatar
    ) {
      token
      account {
        id
        name
        email
        role
        avatar
      }
    }
  }
`;
const LOG_IN = gql`
  mutation LoginMutation($email: String!, $password: String) {
    login(email: $email, password: $password) {
      token
      account {
        id
        name
        email
        role
        avatar
      }
    }
  }
`;
const CREATE_LOAI_TRUYEN = gql`
  mutation createLoaiTruyen($name: String!) {
    createTheLoaiTruyen(name: $name) {
      id
      name
    }
  }
`;
const LOG_OUT = gql`
  mutation logoutAccount {
    logout
  }
`;


const CREATE_TRUYEN = gql`
  mutation MutationCreateTruyen($data: TruyenCreateInput!) {
    createTruyen(data: $data) {
      id
      tentruyen
    }
  }
`;

const HANDLE_REFRESH_TOKEN = gql`
  mutation MutationRefreshToken {
    refreshToken {
      token
    }
  }
`;

const GET_ID_TRUYEN = gql`
  mutation MutationIdTruyen($name: String!) {
    getIdTruyen(name: $name) {
      id
    }
  }
`;
const GET_LIST_CHUONG_FROM_LINK_TRUYEN = gql`
  mutation MutationGetListChuong($link: String!) {
    getListChuongFromLinkTruyen(link: $link) {
      titles
      urls
    }
  }
`;
const CREATE_CHUONG_WITH_ADMIN = gql`
  mutation MutationCreateChuongWithAdmin($linkChuong: String!, $title: String!, $idTruyen: String!) {
    createChuongAdmin(linkChuong: $linkChuong, title: $title, idTruyen: $idTruyen) {
      id
    }
  }
`;

export {
  REGISTER,
  LOG_IN,
  LOG_OUT,
  CREATE_TRUYEN,
  HANDLE_REFRESH_TOKEN,
  GET_ID_TRUYEN,
  GET_LIST_CHUONG_FROM_LINK_TRUYEN,
  CREATE_CHUONG_WITH_ADMIN,
  CREATE_LOAI_TRUYEN
};
