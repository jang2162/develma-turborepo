export const a = 123;
// import { shortUUIDv4 } from '@util/tools';
// import { GraphQLError } from 'graphql/error';
// import jwt from 'jsonwebtoken';
// import { IAccessToken } from '../types';
//
// export abstract class AbstractAuthService {
//     static readonly token = Symbol('AUTH_SERVICE');
//
//     abstract getJwtOptions(): {
//         secret: string;
//         issuer: string;
//         expiresIn: number;
//         refreshExpiredIn: number;
//     };
//     abstract getUserRoleIds(userId: number): Promise<number[]>;
//     abstract onIssuedNewToken(
//         accessToken: string,
//         tokenData: {
//             refreshKey: string;
//             accessKey: string;
//         },
//     ): void;
//     async authentication(response: Response, userId: number, tokenCheckValue: string) {
//         const { issuer, expiresIn, refreshExpiredIn, secret } = this.getJwtOptions();
//         const refreshKey = shortUUIDv4();
//         const accessKey = shortUUIDv4();
//         const roles = await this.getUserRoleIds(userId);
//         // await insertAuthToken(trx, {
//         //     userId,
//         //     refreshKey,
//         //     accessKey,
//         //     tokenCheckValue,
//         // });
//         const accessToken = jwt.sign(
//             {
//                 uid: userId,
//                 rol: roles,
//                 rfk: refreshKey,
//             },
//             secret,
//             {
//                 issuer: issuer,
//                 subject: 'ACCESS_TOKEN',
//                 expiresIn: expiresIn,
//                 jwtid: accessKey,
//                 noTimestamp: true,
//             },
//         );
//
//         response.cookie('token', accessToken, {
//             secure: Env.JWT_COOKIE_SECURE,
//             domain: Env.JWT_COOKIE_DOMAIN,
//             expires: new Date(Date.now() + Env.JWT_REFRESH_EXPIRED_IN * 1000),
//             httpOnly: true,
//             sameSite: 'lax',
//         });
//     }
//
//     async refresh(response: Response, accessTokenPayload: IAccessToken) {
//         const { trx, release } = await getTransaction();
//         let token: string;
//         try {
//             const authData = await selectAuthData(trx, {
//                 refreshKey: accessTokenPayload.rfk,
//             });
//             const { tokenCheckValue } = await selectUser(trx, {
//                 id: accessTokenPayload.uid,
//             });
//
//             if (!tokenCheckValue || !authData || authData.userId !== accessTokenPayload.uid) {
//                 throw new GraphQLError('', genGraphqlErrorCode('genGraphqlErrorCode'));
//             }
//
//             if (authData.tokenCheckValue !== tokenCheckValue) {
//                 throw new GraphQLError('', genGraphqlErrorCode('genGraphqlErrorCode'));
//             }
//
//             if (authData.refreshInterval > Env.JWT_REFRESH_EXPIRED_IN) {
//                 throw new GraphQLError('', genGraphqlErrorCode('genGraphqlErrorCode'));
//             }
//
//             if (authData.accessKey !== accessTokenPayload.jti) {
//                 await invalidateToken(trx, {
//                     refreshKey: accessTokenPayload.rfk,
//                 });
//                 throw new GraphQLError('', genGraphqlErrorCode('genGraphqlErrorCode'));
//             }
//             const accessKey = shortUUIDv4();
//             const roles = (
//                 await selectRoleByUserId(trx, {
//                     userId: accessTokenPayload.uid,
//                 })
//             ).map((item) => item.roleId);
//             await renewAccessKey(trx, {
//                 accessKey,
//                 refreshKey: accessTokenPayload.rfk,
//             });
//             token = jwt.sign(
//                 {
//                     uid: accessTokenPayload.uid,
//                     rol: roles,
//                     rfk: accessTokenPayload.rfk,
//                 },
//                 Env.JWT_SECRET,
//                 {
//                     issuer: Env.JWT_ISSUER,
//                     subject: 'ACCESS_TOKEN',
//                     expiresIn: Env.JWT_EXPIRED_IN,
//                     jwtid: accessKey,
//                     noTimestamp: true,
//                 },
//             );
//             release();
//         } catch (e) {
//             release(true);
//             throw e;
//         }
//         response.cookie('token', token, {
//             secure: Env.JWT_COOKIE_SECURE,
//             domain: Env.JWT_COOKIE_DOMAIN,
//             expires: new Date(Date.now() + Env.JWT_REFRESH_EXPIRED_IN * 1000),
//             httpOnly: true,
//             sameSite: 'lax',
//         });
//         await redisClient.expire(`USER:${accessTokenPayload.uid}`, Env.JWT_REFRESH_EXPIRED_IN * 2);
//     }
//
//     async invalidate(response: Response, accessTokenPayload: IAccessToken) {
//         const { trx, release } = await getTransaction();
//         try {
//             await invalidateToken(trx, { accessKey: accessTokenPayload.jti });
//             response.clearCookie('token', {
//                 secure: Env.JWT_COOKIE_SECURE,
//                 domain: Env.JWT_COOKIE_DOMAIN,
//                 httpOnly: true,
//                 sameSite: 'lax',
//             });
//             await redisClient.del(`USER:${accessTokenPayload.uid}`);
//             release(true);
//         } catch (e) {
//             release(true);
//         }
//     }
//
//     verify(token: string) {
//         let payload = null;
//         let err = 0; // 0 정상, 1: 만료, 2: 검증불가
//         try {
//             payload = jwt.verify(token, Env.JWT_SECRET, {
//                 issuer: Env.JWT_ISSUER,
//                 subject: 'ACCESS_TOKEN',
//             });
//         } catch (e) {
//             if ((e as Error).name === 'TokenExpiredError') {
//                 try {
//                     payload = jwt.verify(token, Env.JWT_SECRET, {
//                         issuer: Env.JWT_ISSUER,
//                         subject: 'ACCESS_TOKEN',
//                         ignoreExpiration: true,
//                     });
//                     err = 1;
//                 } catch (e) {
//                     err = 2;
//                 }
//             } else {
//                 err = 2;
//             }
//         }
//         return { payload, err };
//     }
// }
