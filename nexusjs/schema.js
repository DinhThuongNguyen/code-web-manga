import { ApolloError } from "apollo-server-errors";
import { DateTimeResolver } from "graphql-scalars";
import {
  asNexusMethod,
  objectType,
  nonNull,
  stringArg,
  arg,
  enumType,
  makeSchema,
  inputObjectType,
  list,
  nullable,
} from "nexus";
import { getIdAndRole } from "./utils";
import { compare, hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import { applyMiddleware } from "graphql-middleware";
import { permissions } from "./permission";
import path from "path";
import Cheerio from "cheerio";
import axios from "axios";
import cookie from "cookie";
import { removeVietnameseTones } from "../util/locdau";

const DateTime = asNexusMethod(DateTimeResolver, "Date");

function getRedis(key, redis) {
  return new Promise((resv, rej) => {
    redis.get(key, (err, reply) => {
      resv(reply);
    });
  });
}

const Query = objectType({
  name: "Query",
  definition(t) {
    t.nullable.field("getTruyenByAccount", {
      type: "Truyen",
      resolve: (_parent, _args, context) => {
        let idAccount;
        try {
          const objToken = getIdAndRole(context);
          idAccount = objToken.id;
        } catch (error) {
          return new ApolloError("test is login", "405");
        }
        return context.prisma.Truyen.findMany({
          where: {
            authorId: idAccount,
          },
        });
      },
    });

    t.nullable.field("getContentForHeader", {
      type: "HeaderPayload",
      resolve: async (parent, args, context) => {
        const { prisma } = context;
        let truyen;
        try {
          truyen = await prisma.truyen.findMany({
            orderBy: {
              update_at: "desc",
            },
          });
        } catch (error) {
          return new ApolloError("Can't get list manga", "404");
        }
        const genre = await prisma.theLoai.findMany();
        return { truyen, TheLoai: genre };
      },
    });

    t.nullable.field("getTheLoai", {
      type: list("TheLoai"),
      resolve: async (parent, args, context) => {
        const { prisma } = context;
        let kq;

        try {
          kq = await prisma.theLoai.findMany();
          // console.log({kq});
        } catch (error) {
          console.log(error);
        }
        return kq;
      },
    });

    t.nullable.field("testUser", {
      type: "Account",
      resolve: (_parent, _args, context) => {
        let idAccount;
        try {
          const objToken = getIdAndRole(context);
          idAccount = objToken.id;
        } catch (error) {
          console.log(error);
          return new ApolloError("test is login", "405");
        }
        return context.prisma.account.findUnique({
          where: {
            id: idAccount,
          },
        });
      },
    });

    t.nullable.field("testAdmin", {
      type: "Account",
      resolve: (_parent, _args, context) => {
        let idAccount;
        try {
          const objToken = getIdAndRole(context);
          idAccount = objToken.id;
        } catch (error) {
          console.log(error);
          return new ApolloError("test is login", "405");
        }
        return context.prisma.account.findUnique({
          where: {
            id: idAccount,
          },
        });
      },
    });

    t.nullable.field("getAccount", {
      type: "Account",
      args: {
        id: stringArg(),
      },
      resolve: (parent, args, context) => {
        return context.prisma.account.findUnique({ where: { id: args.id } });
      },
    });

    t.nullable.field("testAuthor", {
      type: "Account",
      resolve: async (_parent, _args, context) => {
        let idAccount;
        try {
          const objToken = getIdAndRole(context);
          idAccount = objToken.id;
          const result = await axios.get(
            "https://truyentranh24.com/long-vuong-truyen-thuyet"
          );
          const chee = await Cheerio.load(result.data);
          const ds = chee("div.manga-chapter .chapter-list div");
          ds.each((idx, el) => {
            const a = chee(".chapter-item span a");
            console.log(chee(a).attr().href);
          });
        } catch (error) {
          console.log(error);
          return new ApolloError("test is login", "405");
        }
        return context.prisma.account.findUnique({
          where: {
            id: idAccount,
          },
        });
      },
    });
  },
});

const Mutation = objectType({
  name: "Mutation",
  definition(t) {
    t.field("register", {
      type: "AuthPayload",
      args: {
        email: stringArg(),
        name: stringArg(),
        password: stringArg(),
        role: stringArg(),
        avatar: stringArg(),
      },
      resolve: async (parent, args, context) => {
        const { redis, prisma, res } = context;
        const hashPassword = await hash(args.password, 10);
        const findEmail = await context.prisma.account.findUnique({
          where: {
            email: args.email,
          },
        });
        if (findEmail) {
          return new ApolloError("Email da ton tai", "405");
        }
        const findName = await prisma.account.findUnique({
          where: {
            name: args.name,
          },
        });

        if (findName) {
          return new ApolloError("Ten da ton tai", "405");
        }
        let account;
        try {
          account = await prisma.account.create({
            data: {
              name: args.name,
              email: args.email,
              password: hashPassword,
              role: args.role,
              avatar: args.avatar,
            },
          });
        } catch (error) {
          console.log(error);
          return new ApolloError("Register failed", "405");
        }

        let token;
        try {
          token = jwt.sign(
            {
              id: account.id,
              role: account.role,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: "10s",
            }
          );
        } catch (err) {
          console.log(err);
          return new ApolloError("Create token failed", "405");
        }

        let refreshToken;
        try {
          refreshToken = jwt.sign(
            {
              id: account.id,
              role: account.role,
              re: "thách mi lấy được token của tau đó",
            },
            process.env.KEY_REFRESH,
            {
              expiresIn: "1y",
            }
          );
        } catch (err) {
          console.log(err);
          return new ApolloError("Create refresh token failed", "405");
        }

        try {
          await redis.set(process.env.REDIS_RFTOKEN, refreshToken);
        } catch (error) {
          console.log(error);
        }

        try {
          res.setHeader(
            "Set-Cookie",
            cookie.serialize("role", account.role, {
              httpOnly: true,
              path: "/",
            })
          );
        } catch (error) {
          console.log(error);
        }

        return {
          token,
          account,
        };
      },
    });

    t.field("logout", {
      type: "Boolean",
      args: {},
      resolve: async (parent, args, context) => {
        const { redis, res } = context;

        res.setHeader(
          "Set-Cookie",
          cookie.serialize("role", "", {
            httpOnly: true,
            path: "/",
            maxAge: -1,
          })
        );

        try {
          redis.del(process.env.REDIS_RFTOKEN);
        } catch (error) {
          console.log(error);
        }
        return true;
      },
    });

    t.field("refreshToken", {
      type: "TokenPayload",
      resolve: async (_, args, context) => {
        const refreshToken = await getRedis(
          process.env.REDIS_RFTOKEN,
          context.redis
        );

        if (!refreshToken) {
          throw new ApolloError("Token does not exist", "405");
        }
        let token;
        try {
          jwt.verify(
            refreshToken,
            process.env.KEY_REFRESH,
            async (err, decode) => {
              if (err) {
                throw new ApolloError("Verify token failed", "405");
              }
              token = jwt.sign(
                {
                  id: decode.id,
                  role: decode.role,
                },
                process.env.JWT_SECRET,
                {
                  expiresIn: "10s",
                }
              );
            }
          );
        } catch (error) {
          throw new ApolloError("Sign token failed", "405");
        }

        return {
          token,
        };
      },
    });

    t.field("updateName", {
      type: "Truyen",
      args: {
        id: stringArg(),
        name: stringArg(),
      },
      resolve: async (_, args, context) => {
        const { id, name } = args;
        const namevn = removeVietnameseTones(name);
        console.log(namevn);
        const { prisma } = context;
        let truyen;
        try {
          truyen = await prisma.theLoai.update({
            where: {
              id,
            },
            data: {
              namekhongdau: namevn,
            },
          });
        } catch (error) {
          console.log(error);
          return new ApolloError("khong duoc", "405");
        }
        return truyen;
      },
    });

    t.field("login", {
      type: "AuthPayload",
      args: {
        email: stringArg(),
        password: stringArg(),
      },
      resolve: async (parent, args, context) => {
        const { prisma, redis, res } = context;
        // console.log(prisma);
        let account;
        try {
          account = await prisma.account.findUnique({
            where: {
              email: args.email,
            },
          });
        } catch (error) {
          console.log(error);
        }
        if (!account) {
          return new ApolloError("Email khong dung", "405");
        }
        const matchPassword = await compare(args.password, account.password);
        if (!matchPassword) {
          return new ApolloError("Sai mat khau", "405");
        }

        let token;
        console.log(account);
        try {
          token = await jwt.sign(
            {
              id: account.id,
              role: account.role,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: "10s",
            }
          );
        } catch (error) {
          console.log(error);
          return new ApolloError("Create token failed", "405");
        }
        let refreshToken;
        try {
          refreshToken = await jwt.sign(
            {
              id: account.id,
              role: account.role,
              re: "thách mi lấy được token của tau đó",
            },
            process.env.KEY_REFRESH,
            {
              expiresIn: "1y",
            }
          );
        } catch (error) {
          console.log(error);
          return new ApolloError("Create refresh token failed", "405");
        }
        try {
          await redis.set(process.env.REDIS_RFTOKEN, refreshToken);
        } catch (error) {
          console.log(error);
        }

        res.setHeader(
          "Set-Cookie",
          cookie.serialize("role", account.role, {
            httpOnly: true,
            path: "/",
            // maxAge: 60 * 60 * 24 * 7 // 1 week
          })
        );

        return {
          token,
          account,
        };
      },
    });

    t.field("updateRoleAccount", {
      type: "Account",
      args: {
        role: stringArg(),
        email: stringArg(),
      },
      resolve: async (parent, args, context) => {
        const { role, email } = args;
        const typeRole = ["USER", "AUTHOR"];
        if (!typeRole.includes(role)) {
          return new ApolloError(
            "Role không hợp lệ hoặc không được viết chữ thường",
            "404"
          );
        }

        let updateAccount;
        try {
          updateAccount = await context.prisma.account.update({
            where: {
              email,
            },
            data: {
              role,
            },
          });
        } catch (error) {
          console.log(error);
          return new ApolloError("Something wrong, try again!", "405");
        }

        return updateAccount;
      },
    });

    t.field("createTruyen", {
      type: "Truyen",
      args: {
        data: nonNull(
          arg({
            type: "TruyenCreateInput",
          })
        ),
      },
      resolve: async (parent, args, context) => {
        let id;
        const refreshToken = await getRedis(
          process.env.REDIS_RFTOKEN,
          context.redis
        );
        try {
          jwt.verify(
            refreshToken,
            process.env.KEY_REFRESH,
            async (err, decode) => {
              id = decode.id;
            }
          );
        } catch (error) {
          throw new ApolloError("Get id Account failed", "405");
        }

        const { tentruyen, avatar, theloai, loaitruyen, country, description } =
          args.data;
        let arrTheloai = [];
        for (let item in theloai) {
          arrTheloai.push({
            id: theloai[item],
          });
        }

        let newTruyen;
        try {
          newTruyen = await context.prisma.truyen.create({
            data: {
              tentruyen,
              namevn: removeVietnameseTones(tentruyen),
              avatar,
              author: {
                connect: {
                  id: id,
                },
              },
              theloai: {
                connect: arrTheloai,
              },
              loaitruyen,
              country,
              description,
            },
          });
        } catch (error) {
          console.log(error);
          return new ApolloError("Tao truyen that bai", "405");
        }
        return newTruyen;
      },
    });

    t.field("getIdTruyen", {
      type: "Truyen",
      args: {
        name: stringArg(),
      },
      resolve: async (parent, args, context) => {
        const { prisma } = context;
        const { name } = args;

        const kq = await prisma.truyen.findUnique({
          where: {
            tentruyen: name,
          },
        });
        if (!kq) {
          return new ApolloError("Khong tim thay truyen", "405");
        }
        return kq;
      },
    });

    t.field("getListChuongFromLinkTruyen", {
      type: "ListChuongPayload",
      args: {
        link: stringArg(),
      },
      resolve: async (parent, args, context) => {
        const { link } = args;
        const truyen = await axios
          .get(link)
          .then((response) => response.data)
          .catch((err) => err);
        const chee = Cheerio.load(truyen);

        const list = chee(
          ".container .main-page .col-md-8 .well #ChapList li a"
        );
        const arr = [];
        const titles = [];
        console.log(list.length);
        list.each((idx, el) => {
          // titles.push("Chap " + (98 - idx).toString());
          titles.push(chee(el).attr().title);
          arr.push(chee(el).attr().href);
        });
        // return;

        return {
          titles: titles,
          urls: arr,
        };
      },
    });

    t.field("createTheLoaiTruyen", {
      type: "TheLoai",
      args: {
        name: stringArg(),
      },
      resolve: async (parent, args, context) => {
        const { prisma } = context;
        const { name } = args;
        const findName = await prisma.theLoai.findUnique({
          where: {
            name,
          },
        });

        if (findName) {
          return new ApolloError("Loại truyện này đã tồn tại", "404");
        }

        let newTheLoai;
        try {
          newTheLoai = await prisma.theLoai.create({
            data: {
              name,
              get: false,
            },
          });
        } catch (error) {
          return new ApolloError("Đã có lỗi xảy ra!", "405");
        }

        return newTheLoai;
      },
    });

    t.field("createChuongAdmin", {
      type: "ChuongTruyen",
      args: {
        linkChuong: stringArg(),
        title: stringArg(),
        idTruyen: stringArg(),
      },
      resolve: async (parent, args, context) => {
        const { prisma } = context;
        const { linkChuong, title, idTruyen } = args;

        const result = await axios
          .get(linkChuong)
          .then((response) => response.data);
        const chee = Cheerio.load(result);
        const listImages = chee(
          ".xemtruyen .center-block .reading-detail .page-chapter img"
        );
        const imageChuong = [];

        listImages.each((idx, el) => {
          const link = chee(el).attr().src;
          // imageChuong.push("https://phemanga.com/" + link);
          // const idxj = link.indexOf(".jpg");
          imageChuong.push(link);
          // if (link.includes("jpg")) {
          //   imageChuong.push(link);
          // }
        });
        // console.log(imageChuong);
        // return;

        let newChuong;
        try {
          newChuong = await prisma.chuongTruyen.create({
            data: {
              name: title,
              truyen: {
                connect: {
                  id: idTruyen,
                },
              },
              textChuong: [],
              images: imageChuong,
            },
          });
        } catch (error) {
          console.log(error);
          return new ApolloError("Tao truyen that bai", "405");
        }

        return newChuong;
      },
    });
  },
});

const Account = objectType({
  name: "Account",
  definition(t) {
    t.nonNull.string("id");
    t.string("name");
    t.string("password");
    t.string("avatar");
    t.string("role", {
      type: "Role",
    });
    t.nonNull.string("email");
    t.nonNull.list.nonNull.field("truyens", {
      type: "Truyen",
      resolve: async (parent, _, context) => {
        let account;
        try {
          account = await context.prisma.account
            .findUnique({
              where: {
                id: parent.id || undefined,
              },
            })
            .truyens();
        } catch (error) {
          console.log(error);
          return new ApolloError("Account failed", "500");
        }
        return account;
      },
    });
  },
});

const Role = enumType({
  name: "Role",
  members: ["USER", "ADMIN", "AUTHOR"],
});

const Truyen = objectType({
  name: "Truyen",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.field("created_at", {
      type: "DateTime",
    });
    t.nonNull.field("updated_at", {
      type: "DateTime",
    });
    t.nonNull.string("tentruyen");
    t.nonNull.string("namevn");
    t.string("avatar");
    t.int("view");
    t.nonNull.list.nonNull.field("theloai", {
      type: "TheLoai",
      resolve: async (parent, _, context) => {
        return context.prisma.truyen
          .findUnique({
            where: {
              id: parent.id || undefined,
            },
          })
          .theloai();
      },
    });
    t.list.field("sochuong", {
      type: "ChuongTruyen",
      resolve: async (parent, _, context) => {
        return context.prisma.truyen
          .findUnique({
            where: {
              id: parent.id || undefined,
            },
          })
          .sochuong();
      },
    });
    t.field("author", {
      type: "Account",
      resolve: (parent, _, context) => {
        return context.prisma.truyen
          .findUnique({
            where: {
              id: parent.id || undefined,
            },
          })
          .author();
      },
    });
    t.string("country", {
      type: "QuocGia",
    });
    t.string("loaitruyen", {
      type: "NhomTruyen",
    });
  },
});

const QuocGia = enumType({
  name: "QuocGia",
  members: ["NhatBan", "HanQuoc", "TruongQuoc", "VietNam"],
});
const NhomTruyen = enumType({
  name: "NhomTruyen",
  members: ["TruyenTranh", "TruyenChu"],
});

const TheLoai = objectType({
  name: "TheLoai",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.string("name");
    t.nonNull.string("namekhongdau");
    t.nonNull.boolean("get");
    t.list.field("truyen", {
      type: "Truyen",
      resolve: async (parent, _, context) => {
        return context.prisma.theloai
          .findUnique({
            where: {
              id: parent.id || undefined,
            },
          })
          .truyen();
      },
    });
  },
});

const ChuongTruyen = objectType({
  name: "ChuongTruyen",
  definition(t) {
    t.nonNull.string("id");
    t.list.nonNull.string("images");
    t.list.nonNull.string("textChuong");
    t.nonNull.string("name");
    t.nonNull.field("create_at", {
      type: "DateTime",
    });
    t.field("truyen", {
      type: "Truyen",
      resolve: (parent, _, context) => {
        return context.prisma.chuongtruyen
          .findUnique({
            where: {
              id: parent.id || undefined,
            },
          })
          .truyen();
      },
    });
  },
});

const AuthPayload = objectType({
  name: "AuthPayload",
  definition(t) {
    t.string("token");
    t.field("account", {
      type: "Account",
    });
  },
});
const HeaderPayload = objectType({
  name: "HeaderPayload",
  definition(t) {
    t.list.field("truyen", {
      type: "Truyen",
    });
    t.list.field("TheLoai", {
      type: "TheLoai",
    });
  },
});

const ListChuongPayload = objectType({
  name: "ListChuongPayload",
  definition(t) {
    t.list.string("titles");
    t.list.string("urls");
  },
});

const TokenPayload = objectType({
  name: "TokenPayload",
  definition(t) {
    t.string("token");
  },
});

const File = objectType({
  name: "File",
  definition(t) {
    t.nonNull.string("url");
  },
});
const Boolean = objectType({
  name: "Boolean",
  definition(t) {
    t.boolean("result");
  },
});

const TruyenCreateInput = inputObjectType({
  name: "TruyenCreateInput",
  definition(t) {
    t.nonNull.string("tentruyen");
    t.string("description");
    t.string("avatar");
    t.string("country");
    t.string("loaitruyen");
    t.list.string("theloai");
  },
});

const AccountCreateInput = inputObjectType({
  name: "AccountCreateInput",
  definition(t) {
    t.nonNull.string("email");
    t.nonNull.string("name");
    t.nonNull.string("password");
  },
});

const AccountUniqueInput = inputObjectType({
  name: "AccountUniqueInput",
  definition(t) {
    t.string("id");
    t.string("email");
  },
});

const schemaWithoutPermissions = makeSchema({
  types: [
    ListChuongPayload,
    TokenPayload,
    Query,
    Mutation,
    Truyen,
    Account,
    TheLoai,
    ChuongTruyen,
    Role,
    AuthPayload,
    AccountUniqueInput,
    AccountCreateInput,
    TruyenCreateInput,
    DateTime,
    File,
    NhomTruyen,
    QuocGia,
    HeaderPayload,
  ],
  outputs: {
    schema: path.join(process.cwd(), "schema.graphql"),
    typegen: path.join(process.cwd(), "nexus.ts"),
  },
  typegenAutoConfig: {
    contextType: "Context.Context",
    sources: [
      {
        source: "@prisma/client",
        alias: "prisma",
      },
      {
        source: require.resolve("./context"),
        alias: "Context",
      },
    ],
  },
});

export const schema = applyMiddleware(schemaWithoutPermissions, permissions);
