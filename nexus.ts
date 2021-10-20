/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */


import type { core } from "nexus"
declare global {
  interface NexusGenCustomInputMethods<TypeName extends string> {
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    Date<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "DateTime";
  }
}
declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    Date<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "DateTime";
  }
}


declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  AccountCreateInput: { // input type
    email: string; // String!
    name: string; // String!
    password: string; // String!
  }
  AccountUniqueInput: { // input type
    email?: string | null; // String
    id?: string | null; // String
  }
  TruyenCreateInput: { // input type
    avatar?: string | null; // String
    country?: string | null; // String
    description?: string | null; // String
    loaitruyen?: string | null; // String
    tentruyen: string; // String!
    theloai?: Array<string | null> | null; // [String]
  }
}

export interface NexusGenEnums {
  NhomTruyen: "TruyenChu" | "TruyenTranh"
  QuocGia: "HanQuoc" | "NhatBan" | "TruongQuoc" | "VietNam"
  Role: "ADMIN" | "AUTHOR" | "USER"
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
  DateTime: any
}

export interface NexusGenObjects {
  Account: { // root type
    avatar?: string | null; // String
    email: string; // String!
    id: string; // String!
    name?: string | null; // String
    password?: string | null; // String
    role?: NexusGenEnums['Role'] | null; // Role
  }
  AuthPayload: { // root type
    account?: NexusGenRootTypes['Account'] | null; // Account
    token?: string | null; // String
  }
  ChuongTruyen: { // root type
    create_at: NexusGenScalars['DateTime']; // DateTime!
    id: string; // String!
    images?: string[] | null; // [String!]
    name: string; // String!
    textChuong?: string[] | null; // [String!]
  }
  File: { // root type
    url: string; // String!
  }
  HeaderPayload: { // root type
    TheLoai?: Array<NexusGenRootTypes['TheLoai'] | null> | null; // [TheLoai]
    truyen?: Array<NexusGenRootTypes['Truyen'] | null> | null; // [Truyen]
  }
  ListChuongPayload: { // root type
    titles?: Array<string | null> | null; // [String]
    urls?: Array<string | null> | null; // [String]
  }
  Mutation: {};
  Query: {};
  TheLoai: { // root type
    get: boolean; // Boolean!
    id: string; // String!
    name: string; // String!
    namekhongdau: string; // String!
  }
  TokenPayload: { // root type
    token?: string | null; // String
  }
  Truyen: { // root type
    avatar?: string | null; // String
    country?: NexusGenEnums['QuocGia'] | null; // QuocGia
    created_at: NexusGenScalars['DateTime']; // DateTime!
    id: string; // String!
    loaitruyen?: NexusGenEnums['NhomTruyen'] | null; // NhomTruyen
    namevn: string; // String!
    tentruyen: string; // String!
    updated_at: NexusGenScalars['DateTime']; // DateTime!
    view?: number | null; // Int
  }
}

export interface NexusGenInterfaces {
}

export interface NexusGenUnions {
}

export type NexusGenRootTypes = NexusGenObjects

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars & NexusGenEnums

export interface NexusGenFieldTypes {
  Account: { // field return type
    avatar: string | null; // String
    email: string; // String!
    id: string; // String!
    name: string | null; // String
    password: string | null; // String
    role: NexusGenEnums['Role'] | null; // Role
    truyens: NexusGenRootTypes['Truyen'][]; // [Truyen!]!
  }
  AuthPayload: { // field return type
    account: NexusGenRootTypes['Account'] | null; // Account
    token: string | null; // String
  }
  ChuongTruyen: { // field return type
    create_at: NexusGenScalars['DateTime']; // DateTime!
    id: string; // String!
    images: string[] | null; // [String!]
    name: string; // String!
    textChuong: string[] | null; // [String!]
    truyen: NexusGenRootTypes['Truyen'] | null; // Truyen
  }
  File: { // field return type
    url: string; // String!
  }
  HeaderPayload: { // field return type
    TheLoai: Array<NexusGenRootTypes['TheLoai'] | null> | null; // [TheLoai]
    truyen: Array<NexusGenRootTypes['Truyen'] | null> | null; // [Truyen]
  }
  ListChuongPayload: { // field return type
    titles: Array<string | null> | null; // [String]
    urls: Array<string | null> | null; // [String]
  }
  Mutation: { // field return type
    createChuongAdmin: NexusGenRootTypes['ChuongTruyen'] | null; // ChuongTruyen
    createTheLoaiTruyen: NexusGenRootTypes['TheLoai'] | null; // TheLoai
    createTruyen: NexusGenRootTypes['Truyen'] | null; // Truyen
    getIdTruyen: NexusGenRootTypes['Truyen'] | null; // Truyen
    getListChuongFromLinkTruyen: NexusGenRootTypes['ListChuongPayload'] | null; // ListChuongPayload
    login: NexusGenRootTypes['AuthPayload'] | null; // AuthPayload
    logout: boolean | null; // Boolean
    refreshToken: NexusGenRootTypes['TokenPayload'] | null; // TokenPayload
    register: NexusGenRootTypes['AuthPayload'] | null; // AuthPayload
    updateName: NexusGenRootTypes['Truyen'] | null; // Truyen
    updateRoleAccount: NexusGenRootTypes['Account'] | null; // Account
  }
  Query: { // field return type
    getAccount: NexusGenRootTypes['Account'] | null; // Account
    getContentForHeader: NexusGenRootTypes['HeaderPayload'] | null; // HeaderPayload
    getTheLoai: Array<NexusGenRootTypes['TheLoai'] | null> | null; // [TheLoai]
    getTruyenByAccount: NexusGenRootTypes['Truyen'] | null; // Truyen
    testAdmin: NexusGenRootTypes['Account'] | null; // Account
    testAuthor: NexusGenRootTypes['Account'] | null; // Account
    testUser: NexusGenRootTypes['Account'] | null; // Account
  }
  TheLoai: { // field return type
    get: boolean; // Boolean!
    id: string; // String!
    name: string; // String!
    namekhongdau: string; // String!
    truyen: Array<NexusGenRootTypes['Truyen'] | null> | null; // [Truyen]
  }
  TokenPayload: { // field return type
    token: string | null; // String
  }
  Truyen: { // field return type
    author: NexusGenRootTypes['Account'] | null; // Account
    avatar: string | null; // String
    country: NexusGenEnums['QuocGia'] | null; // QuocGia
    created_at: NexusGenScalars['DateTime']; // DateTime!
    id: string; // String!
    loaitruyen: NexusGenEnums['NhomTruyen'] | null; // NhomTruyen
    namevn: string; // String!
    sochuong: Array<NexusGenRootTypes['ChuongTruyen'] | null> | null; // [ChuongTruyen]
    tentruyen: string; // String!
    theloai: NexusGenRootTypes['TheLoai'][]; // [TheLoai!]!
    updated_at: NexusGenScalars['DateTime']; // DateTime!
    view: number | null; // Int
  }
}

export interface NexusGenFieldTypeNames {
  Account: { // field return type name
    avatar: 'String'
    email: 'String'
    id: 'String'
    name: 'String'
    password: 'String'
    role: 'Role'
    truyens: 'Truyen'
  }
  AuthPayload: { // field return type name
    account: 'Account'
    token: 'String'
  }
  ChuongTruyen: { // field return type name
    create_at: 'DateTime'
    id: 'String'
    images: 'String'
    name: 'String'
    textChuong: 'String'
    truyen: 'Truyen'
  }
  File: { // field return type name
    url: 'String'
  }
  HeaderPayload: { // field return type name
    TheLoai: 'TheLoai'
    truyen: 'Truyen'
  }
  ListChuongPayload: { // field return type name
    titles: 'String'
    urls: 'String'
  }
  Mutation: { // field return type name
    createChuongAdmin: 'ChuongTruyen'
    createTheLoaiTruyen: 'TheLoai'
    createTruyen: 'Truyen'
    getIdTruyen: 'Truyen'
    getListChuongFromLinkTruyen: 'ListChuongPayload'
    login: 'AuthPayload'
    logout: 'Boolean'
    refreshToken: 'TokenPayload'
    register: 'AuthPayload'
    updateName: 'Truyen'
    updateRoleAccount: 'Account'
  }
  Query: { // field return type name
    getAccount: 'Account'
    getContentForHeader: 'HeaderPayload'
    getTheLoai: 'TheLoai'
    getTruyenByAccount: 'Truyen'
    testAdmin: 'Account'
    testAuthor: 'Account'
    testUser: 'Account'
  }
  TheLoai: { // field return type name
    get: 'Boolean'
    id: 'String'
    name: 'String'
    namekhongdau: 'String'
    truyen: 'Truyen'
  }
  TokenPayload: { // field return type name
    token: 'String'
  }
  Truyen: { // field return type name
    author: 'Account'
    avatar: 'String'
    country: 'QuocGia'
    created_at: 'DateTime'
    id: 'String'
    loaitruyen: 'NhomTruyen'
    namevn: 'String'
    sochuong: 'ChuongTruyen'
    tentruyen: 'String'
    theloai: 'TheLoai'
    updated_at: 'DateTime'
    view: 'Int'
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    createChuongAdmin: { // args
      idTruyen?: string | null; // String
      linkChuong?: string | null; // String
      title?: string | null; // String
    }
    createTheLoaiTruyen: { // args
      name?: string | null; // String
    }
    createTruyen: { // args
      data: NexusGenInputs['TruyenCreateInput']; // TruyenCreateInput!
    }
    getIdTruyen: { // args
      name?: string | null; // String
    }
    getListChuongFromLinkTruyen: { // args
      link?: string | null; // String
    }
    login: { // args
      email?: string | null; // String
      password?: string | null; // String
    }
    register: { // args
      avatar?: string | null; // String
      email?: string | null; // String
      name?: string | null; // String
      password?: string | null; // String
      role?: string | null; // String
    }
    updateName: { // args
      id?: string | null; // String
      name?: string | null; // String
    }
    updateRoleAccount: { // args
      email?: string | null; // String
      role?: string | null; // String
    }
  }
  Query: {
    getAccount: { // args
      id?: string | null; // String
    }
  }
}

export interface NexusGenAbstractTypeMembers {
}

export interface NexusGenTypeInterfaces {
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = keyof NexusGenInputs;

export type NexusGenEnumNames = keyof NexusGenEnums;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = never;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = never;

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    isTypeOf: false
    resolveType: true
    __typename: false
  }
}

export interface NexusGenTypes {
  context: any;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  inputTypeShapes: NexusGenInputs & NexusGenEnums & NexusGenScalars;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  fieldTypeNames: NexusGenFieldTypeNames;
  allTypes: NexusGenAllTypes;
  typeInterfaces: NexusGenTypeInterfaces;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractTypeMembers: NexusGenAbstractTypeMembers;
  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;
  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;
  features: NexusGenFeaturesConfig;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginInputTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
  interface NexusGenPluginArgConfig {
  }
}