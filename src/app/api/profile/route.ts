// // import { NextRequest, NextResponse } from 'next/server';
// // import { getServerSession } from 'next-auth';
// // import { authOptions } from '@/lib/auth';
// // import { prisma } from '@/lib/db';
// // import { z } from 'zod';

// // const profileSchema = z.object({
// //   headline: z.string().optional(),
// //   location: z.string().optional(),
// //   salaryMin: z.number().optional(),
// //   salaryMax: z.number().optional(),
// //   summary: z.string().optional(),
// // });

// // export async function GET(request: NextRequest) {
// //   try {
// //     const session = await getServerSession(authOptions);
// //     if (!session?.user?.id) {
// //       return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
// //     }

// //     const profile = await prisma.profile.findUnique({
// //       where: { userId: session.user.id },
// //     });

// //     return NextResponse.json({ profile });
// //   } catch (error) {
// //     console.error('Get profile error:', error);
// //     return NextResponse.json(
// //       { message: 'Internal server error' },
// //       { status: 500 }
// //     );
// //   }
// // }

// // export async function POST(request: NextRequest) {
// //   try {
// //     const session = await getServerSession(authOptions);
// //     if (!session?.user?.id) {
// //       return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
// //     }

// //     const body = await request.json();
// //     const { headline, location, salaryMin, salaryMax, summary } = profileSchema.parse(body);

// //     // Upsert profile (create or update)
// //     const profile = await prisma.profile.upsert({
// //       where: { userId: session.user.id },
// //       update: {
// //         headline,
// //         location,
// //         salaryMin,
// //         salaryMax,
// //         summary,
// //         updatedAt: new Date(),
// //       },
// //       create: {
// //         userId: session.user.id,
// //         headline,
// //         location,
// //         salaryMin,
// //         salaryMax,
// //         summary,
// //       },
// //     });

// //     return NextResponse.json({ 
// //       message: 'Profile saved successfully',
// //       profile 
// //     });
// //   } catch (error) {
// //     console.error('Save profile error:', error);
    
// //     if (error instanceof z.ZodError) {
// //       return NextResponse.json(
// //         { message: 'Invalid input data', errors: error.errors },
// //         { status: 400 }
// //       );
// //     }

// //     return NextResponse.json(
// //       { message: 'Internal server error' },
// //       { status: 500 }
// //     );
// //   }
// // }
// // import { NextRequest, NextResponse } from 'next/server';
// // import { getServerSession } from 'next-auth/next';
// // import { authOptions } from '@/lib/auth';
// // import { prisma } from '@/lib/db';
// // import { z } from 'zod';

// // const profileSchema = z.object({
// //   headline: z.string().optional(),
// //   location: z.string().optional(),
// //   salaryMin: z.number().optional(),
// //   salaryMax: z.number().optional(),
// //   summary: z.string().optional(),
// // });

// // export async function GET(request: NextRequest) {
// //   try {
// //     const session = await getServerSession(authOptions);
    
// //     if (!session?.user?.email) {
// //       return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
// //     }

// //     // Find user by email since that's what we have in the session
// //     const user = await prisma.user.findUnique({
// //       where: { email: session.user.email },
// //       include: { profile: true },
// //     });

// //     if (!user) {
// //       return NextResponse.json({ message: 'User not found' }, { status: 404 });
// //     }

// //     return NextResponse.json({ profile: user.profile });
// //   } catch (error) {
// //     console.error('Get profile error:', error);
// //     return NextResponse.json(
// //       { message: 'Internal server error' },
// //       { status: 500 }
// //     );
// //   }
// // }

// import { NextRequest, NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth/next';
// import { authOptions } from '@/lib/auth';
// import { prisma } from '@/lib/db';
// import { z } from 'zod';

// export async function GET(request: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions);
    
//     // Debug logging
//     console.log('Session in API:', session);
//     console.log('User in session:', session?.user);
    
//     if (!session?.user?.email) {
//       console.log('No session or user email found');
//       return NextResponse.json({ message: 'Unauthorized - No session' }, { status: 401 });
//     }

//     const user = await prisma.user.findUnique({
//       where: { email: session.user.email },
//       include: { profile: true },
//     });

//     console.log('Found user:', user?.id);

//     if (!user) {
//       return NextResponse.json({ message: 'User not found' }, { status: 404 });
//     }

//     return NextResponse.json({ profile: user.profile });
//   } catch (error) {
//     console.error('Get profile error:', error);
//     return NextResponse.json(
//       { message: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

// // ... rest of the file stays the same

// export async function POST(request: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions);
    
//     if (!session?.user?.email) {
//       return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
//     }

//     // Find user by email
//     const user = await prisma.user.findUnique({
//       where: { email: session.user.email },
//     });

//     if (!user) {
//       return NextResponse.json({ message: 'User not found' }, { status: 404 });
//     }

//     const body = await request.json();
//     const { headline, location, salaryMin, salaryMax, summary } = profileSchema.parse(body);

//     // Upsert profile using the user ID we found
//     const profile = await prisma.profile.upsert({
//       where: { userId: user.id },
//       update: {
//         headline,
//         location,
//         salaryMin,
//         salaryMax,
//         summary,
//         updatedAt: new Date(),
//       },
//       create: {
//         userId: user.id,
//         headline,
//         location,
//         salaryMin,
//         salaryMax,
//         summary,
//       },
//     });

//     return NextResponse.json({ 
//       message: 'Profile saved successfully',
//       profile 
//     });
//   } catch (error) {
//     console.error('Save profile error:', error);
    
//     if (error instanceof z.ZodError) {
//       return NextResponse.json(
//         { message: 'Invalid input data', errors: error.errors },
//         { status: 400 }
//       );
//     }

//     return NextResponse.json(
//       { message: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const profileSchema = z.object({
  headline: z.string().optional(),
  location: z.string().optional(),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  summary: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { profile: true },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ profile: user.profile });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    
    // Simple validation without Zod for now
    const { headline, location, salaryMin, salaryMax, summary } = body;

    const profile = await prisma.profile.upsert({
      where: { userId: user.id },
      update: {
        headline: headline || null,
        location: location || null,
        salaryMin: salaryMin || null,
        salaryMax: salaryMax || null,
        summary: summary || null,
        updatedAt: new Date(),
      },
      create: {
        userId: user.id,
        headline: headline || null,
        location: location || null,
        salaryMin: salaryMin || null,
        salaryMax: salaryMax || null,
        summary: summary || null,
      },
    });

    return NextResponse.json({ 
      message: 'Profile saved successfully',
      profile 
    });
  } catch (error) {
    console.error('Save profile error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}