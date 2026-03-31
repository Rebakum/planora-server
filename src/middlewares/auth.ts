// import { NextFunction, Request, Response } from "express";
// import { auth as betterAuth } from "../lib/auth";

// export enum UserRole {
//   user = "USER",
//   admin = "ADMIN",
// }

// const auth = (...roles: UserRole[]) => {
//   return async (req: any, res: Response, next: NextFunction) => {
//     try {
//       const session = await betterAuth.api.getSession({
//         headers: req.headers as any,
        
//       });
//       console.log("HEADERS:", req.headers);
// console.log("HEADERS:", req.headers);
// console.log("SESSION:", session);


//             if (!session?.user?.id) {
//         return res.status(401).json({
//           success: false,
//           message: "No valid session found",
//         });
//       }

//       if (!session.user.emailVerified) {
//         return res.status(403).json({
//           success: false,
//           message: "Please verify your email first",
//         });
//       }

//       req.user = {
//         id: session.user.id,
//         email: session.user.email,
//         name: session.user.name,
//         role: (session.user.role as UserRole) || UserRole.user,
//         emailVerified: session.user.emailVerified,
//       };

//       if (roles.length > 0 && !roles.includes(req.user.role)) {
//         return res.status(403).json({
//           success: false,
//           message: "Forbidden",
//         });
//       }

//       next();
//     } catch (error) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid session",
//       });
//     }
//   };
// };

// export default auth;