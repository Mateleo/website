import { Type } from "@sinclair/typebox";

const BasicAssociation = {
    _id: Type.String(),
    name: Type.String({ maxLength: 64, minLength: 1 }),
    federation: Type.Optional(Type.Object({
        isValidated: Type.Boolean(),
        region: Type.String()
    })),
    logo: Type.Optional(Type.String()),
    networks: Type.Optional(Type.Object({
        facebook: Type.String(),
        instagram: Type.String(),
        twitch: Type.String(),
        twitter: Type.String()
    })),
    school: Type.Object({
        name: Type.String({ maxLength: 64, minLength: 1 }),
        address: Type.String(),
        studentsNumber: Type.Number()
    }),
    settings: Type.Optional(Type.Object({
        slug: Type.String()
    })),
    tag: Type.Optional(Type.String())
};

const PrivateFields = {
    mail: Type.String()
};

const Users = {
    users: Type.Object({
        members: Type.Array(Type.String()),
        moderators: Type.Array(Type.String()),
        owner: Type.String()
    })
};

const TypeBasicAssociationUser = Type.Object({
    _id: Type.String(),
    name: Type.Optional(Type.String()),
    avatar: Type.Optional(Type.String()),
    mail: Type.String(),
    platforms: Type.Object({
        discord: Type.String()
    }),
    roles: Type.Array(Type.String()),
    username: Type.String()
});

const FullUsers = {
    users: Type.Optional(Type.Object({
        members: Type.Array(TypeBasicAssociationUser),
        moderators: Type.Array(TypeBasicAssociationUser),
        owner: TypeBasicAssociationUser
    }))
};

export const TypeBasicAssociation = Type.Object(BasicAssociation);

export const TypeBasicUpdateAssociation = Type.Object({
    ...BasicAssociation,
    ...PrivateFields
});

export const TypeBasicAdminAssociation = Type.Object({
    ...BasicAssociation,
    ...PrivateFields
});

export const TypeMemberAssociation = Type.Object({
    ...BasicAssociation,
    ...PrivateFields,
    ...Users
});

export const TypeFullMemberAssociation = Type.Object({
    ...BasicAssociation,
    ...PrivateFields,
    ...FullUsers
});
