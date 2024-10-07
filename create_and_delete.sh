#!/bin/bash

# setup_auth.sh
# This script sets up Supabase authentication in your existing monorepo.

# Exit immediately if a command exits with a non-zero status.
set -e

# Function to create directories
create_dir() {
  if [ ! -d "$1" ]; then
    mkdir -p "$1"
    echo "Created directory: $1"
  else
    echo "Directory already exists: $1"
  fi
}

# Function to create files with content
create_file() {
  if [ ! -f "$1" ]; then
    cat <<EOF > "$1"
$2
EOF
    echo "Created file: $1"
  else
    echo "File already exists: $1"
  fi
}

# Function to append to files if needed
append_to_file() {
  cat <<EOF >> "$1"

$2
EOF
  echo "Appended to file: $1"
}

# Prompt for environment variables
echo "Please enter your Supabase details for local setup:"
read -p "Supabase DB User [supabase_user]: " SUPABASE_USER
SUPABASE_USER=${SUPABASE_USER:-supabase_user}

read -p "Supabase DB Password [supabase_password]: " SUPABASE_PASSWORD
SUPABASE_PASSWORD=${SUPABASE_PASSWORD:-supabase_password}

read -p "Supabase DB Name [supabase_db]: " SUPABASE_DB
SUPABASE_DB=${SUPABASE_DB:-supabase_db}

read -p "Supabase Auth External URL [http://localhost:9999]: " SUPABASE_AUTH_URL
SUPABASE_AUTH_URL=${SUPABASE_AUTH_URL:-http://localhost:9999}

read -p "Supabase Project URL [http://localhost:3000]: " SUPABASE_PROJECT_URL
SUPABASE_PROJECT_URL=${SUPABASE_PROJECT_URL:-http://localhost:3000}

# Step 1: Create Docker Compose for Supabase
create_file "docker-compose.yml" "version: '3.8'

services:
  postgres:
    image: postgres:13
    restart: always
    environment:
      POSTGRES_USER: $SUPABASE_USER
      POSTGRES_PASSWORD: $SUPABASE_PASSWORD
      POSTGRES_DB: $SUPABASE_DB
    ports:
      - '5432:5432'
    volumes:
      - supabase_data:/var/lib/postgresql/data

  gotrue:
    image: supabase/gotrue:latest
    restart: always
    environment:
      API_EXTERNAL_URL: $SUPABASE_AUTH_URL
      DB_URI: postgres://$SUPABASE_USER:$SUPABASE_PASSWORD@postgres:5432/$SUPABASE_DB
      JWT_SECRET: your_jwt_secret
      SITE_URL: $SUPABASE_PROJECT_URL
    ports:
      - '9999:9999'
    depends_on:
      - postgres

volumes:
  supabase_data:
"

# Step 2: Create Frontend File Structure and Files

# Create directories
create_dir "frontend/src/app/login"
create_dir "frontend/src/utils"
create_dir "frontend/src/app/dashboard"
create_dir "frontend/src/components"
create_dir "frontend/src/app/signup" # Renamed from signin to signup

# Create supabaseClient.ts
create_file "frontend/src/utils/supabaseClient.ts" "import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
"

# Create login page (page.tsx) with default credentials for testing
create_file "frontend/src/app/login/page.tsx" "import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../utils/supabaseClient';

const LoginPage: React.FC = () => {
  // Default credentials for testing purposes
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error, session } = await supabase.auth.signIn({ email, password });
    if (error) {
      alert('Invalid credentials');
    } else {
      // Store authentication state
      localStorage.setItem('authenticated', 'true');
      router.push('/dashboard');
    }
  };

  return (
    <div className=\"flex items-center justify-center min-h-screen bg-gray-100\">
      <form className=\"p-6 bg-white rounded shadow-md\" onSubmit={handleLogin}>
        <h2 className=\"mb-4 text-2xl font-bold\">Login</h2>
        <div className=\"mb-4\">
          <label className=\"block text-sm font-medium text-gray-700\">Email</label>
          <input
            type=\"email\"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className=\"w-full p-2 mt-1 border rounded\"
            required
          />
        </div>
        <div className=\"mb-4\">
          <label className=\"block text-sm font-medium text-gray-700\">Password</label>
          <input
            type=\"password\"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className=\"w-full p-2 mt-1 border rounded\"
            required
          />
        </div>
        <button type=\"submit\" className=\"w-full p-2 text-white bg-blue-600 rounded\">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
"

# Create dashboard page with auth check (page.tsx)
create_file "frontend/src/app/dashboard/page.tsx" "import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';

const DashboardPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const session = supabase.auth.session();
      if (!session) {
        router.push('/login');
      }
    };
    checkAuth();
  }, [router]);

  return (
    <div>
      <h1>Welcome to the Dashboard!</h1>
      {/* Your existing dashboard code here */}
    </div>
  );
};

export default DashboardPage;
"

# Create SignUpPage component from provided HTML
create_file "frontend/src/app/signup/page.tsx" "import React, { useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useRouter } from 'next/router';

const SignUpPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    const { user, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      alert(error.message);
    } else {
      // Optionally, save additional user info to your database
      // Redirect to dashboard or login
      router.push('/dashboard');
    }
  };

  return (
    <div className=\"bg-white dark:bg-darkblack-500 flex flex-col lg:flex-row justify-between min-h-screen\">
      {/* Left Section */}
      <div className=\"lg:w-1/2 px-5 xl:pl-12 pt-10\">
        <header>
          <a href=\"/\" className=\"\">
            <img src=\"/assets/images/logo/logo-color.svg\" className=\"block dark:hidden\" alt=\"Logo\" />
            <img src=\"/assets/images/logo/logo-white.svg\" className=\"hidden dark:block\" alt=\"Logo\" />
          </a>
        </header>
        <div className=\"max-w-[460px] m-auto pt-24 pb-16\">
          <header className=\"text-center mb-8\">
            <h2 className=\"text-bgray-900 dark:text-white text-4xl font-semibold font-poppins mb-2\">
              Sign up for an account
            </h2>
            <p className=\"font-urbanis text-base font-medium text-bgray-600 dark:text-darkblack-300\">
              Send, spend and save smarter
            </p>
          </header>
          {/* Google & Apple Button */}
          <div className=\"flex flex-col md:flex-row gap-4\">
            <button className=\"inline-flex justify-center items-center gap-x-2 border border-bgray-300 dark:border-darkblack-400 rounded-lg px-6 py-4 text-base text-bgray-900 dark:text-white font-medium\">
              {/* Google SVG Icon */}
              <svg
                width=\"23\"
                height=\"22\"
                viewBox=\"0 0 23 22\"
                fill=\"none\"
                xmlns=\"http://www.w3.org/2000/svg\"
              >
                <!-- SVG paths -->
              </svg>
              <span> Sign Up with Google </span>
            </button>
            <button className=\"inline-flex justify-center items-center gap-x-2 border border-bgray-300 dark:border-darkblack-400 rounded-lg px-6 py-4 text-base text-bgray-900 dark:text-white font-medium\">
              {/* Apple SVG Icon */}
              <svg
                className=\"fill-bgray-900 dark:fill-white\"
                width=\"21\"
                height=\"22\"
                viewBox=\"0 0 21 22\"
                fill=\"none\"
                xmlns=\"http://www.w3.org/2000/svg\"
              >
                <!-- SVG paths -->
              </svg>
              <span> Sign Up with Apple </span>
            </button>
          </div>
          <div className=\"relative mt-6 mb-5\">
            <div className=\"absolute inset-0 flex items-center\">
              <div className=\"w-full border-t border-gray-300 dark:border-darkblack-400\"></div>
            </div>
            <div className=\"relative flex justify-center text-sm\">
              <span className=\"bg-white dark:bg-darkblack-500 px-2 text-base text-bgray-600\">Or continue with</span>
            </div>
          </div>
          {/* Form */}
          <form onSubmit={handleSignUp}>
            <div className=\"flex flex-col md:flex-row gap-4 justify-between mb-4\">
              <div>
                <input
                  type=\"text\"
                  className=\"text-bgray-800 dark:text-white dark:bg-darkblack-500 dark:border-darkblack-400 text-base border border-bgray-300 h-14 w-full focus:border-success-300 focus:ring-0 rounded-lg px-4 py-3.5 placeholder:text-bgray-500 placeholder:text-base\"
                  placeholder=\"First name\"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div>
                <input
                  type=\"text\"
                  className=\"text-bgray-800 dark:text-white dark:bg-darkblack-500 dark:border-darkblack-400 text-base border border-bgray-300 h-14 w-full focus:border-success-300 focus:ring-0 rounded-lg px-4 py-3.5 placeholder:text-bgray-500 placeholder:text-base\"
                  placeholder=\"Last name\"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className=\"mb-4\">
              <input
                type=\"email\"
                className=\"text-bgray-800 dark:text-white dark:bg-darkblack-500 dark:border-darkblack-400 text-base border border-bgray-300 h-14 w-full focus:border-success-300 focus:ring-0 rounded-lg px-4 py-3.5 placeholder:text-bgray-500 placeholder:text-base\"
                placeholder=\"Email\"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className=\"mb-6 relative\">
              <input
                type=\"password\"
                className=\"text-bgray-800 dark:text-white dark:bg-darkblack-500 dark:border-darkblack-400 text-base border border-bgray-300 h-14 w-full focus:border-success-300 focus:ring-0 rounded-lg px-4 py-3.5 placeholder:text-bgray-500 placeholder:text-base\"
                placeholder=\"Password\"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type=\"button\" className=\"absolute top-4 right-4 bottom-4\">
                {/* Eye Icon SVG */}
                <svg
                  width=\"22\"
                  height=\"20\"
                  viewBox=\"0 0 22 20\"
                  fill=\"none\"
                  xmlns=\"http://www.w3.org/2000/svg\"
                >
                  <!-- SVG paths -->
                </svg>
              </button>
            </div>
            <div className=\"mb-6 relative\">
              <input
                type=\"password\"
                className=\"text-bgray-800 dark:text-white dark:bg-darkblack-500 dark:border-darkblack-400 text-base border border-bgray-300 h-14 w-full focus:border-success-300 focus:ring-0 rounded-lg px-4 py-3.5 placeholder:text-bgray-500 placeholder:text-base\"
                placeholder=\"Confirm Password\"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button type=\"button\" className=\"absolute top-4 right-4 bottom-4\">
                {/* Eye Icon SVG */}
                <svg
                  width=\"22\"
                  height=\"20\"
                  viewBox=\"0 0 22 20\"
                  fill=\"none\"
                  xmlns=\"http://www.w3.org/2000/svg\"
                >
                  <!-- SVG paths -->
                </svg>
              </button>
            </div>
            <div className=\"flex justify-between mb-7\">
              <div className=\"flex items-center gap-x-3\">
                <input
                  type=\"checkbox\"
                  className=\"w-5 h-5 focus:ring-transparent rounded-md border border-bgray-300 focus:accent-success-300 text-success-300 dark:bg-transparent dark:border-darkblack-400\"
                  name=\"agree\"
                  id=\"agree\"
                  required
                />
                <label htmlFor=\"agree\" className=\"text-bgray-600 dark:text-bgray-50 text-base\">
                  By creating an account, you agree to our
                  <span className=\"text-bgray-900 dark:text-white\"> Privacy Policy,</span> and
                  <span className=\"text-bgray-900 dark:text-white\"> Terms of Service.</span>
                </label>
              </div>
            </div>
            <button type=\"submit\" className=\"py-3.5 flex items-center justify-center text-white font-bold bg-success-300 hover:bg-success-400 transition-all rounded-lg w-full\">
              Sign Up
            </button>
          </form>
          {/* Form Bottom */}
          <p className=\"text-center text-bgray-900 dark:text-bgray-50 text-base font-medium pt-7\">
            Already have an account?
            <a href=\"/login\" className=\"font-semibold underline\"> Sign In</a>
          </p>
          <nav className=\"flex items-center justify-center flex-wrap gap-x-11 pt-24\">
            <a href=\"#\" className=\"text-sm text-bgray-700 dark:text-bgray-50\">Terms & Conditions</a>
            <a href=\"#\" className=\"text-sm text-bgray-700 dark:text-bgray-50\">Privacy Policy</a>
            <a href=\"#\" className=\"text-sm text-bgray-700 dark:text-bgray-50\">Help</a>
            <a href=\"#\" className=\"text-sm text-bgray-700 dark:text-bgray-50\">English</a>
          </nav>
          {/* Copyright */}
          <p className=\"text-bgray-600 dark:text-darkblack-300 text-center text-sm mt-6\">
            &copy; 2023 Bankco. All Rights Reserved.
          </p>
        </div>
      </div>
      {/* Right Section */}
      <div className=\"lg:w-1/2 lg:block hidden bg-[#F6FAFF] dark:bg-darkblack-600 p-20 relative\">
        <ul>
          <li className=\"absolute top-10 left-8\">
            <img src=\"/assets/images/shapes/square.svg\" alt=\"\" />
          </li>
          <li className=\"absolute right-12 top-14\">
            <img src=\"/assets/images/shapes/vline.svg\" alt=\"\" />
          </li>
          <li className=\"absolute bottom-7 left-8\">
            <img src=\"/assets/images/shapes/dotted.svg\" alt=\"\" />
          </li>
        </ul>
        <div className=\"mb-10\">
          <img src=\"/assets/images/illustration/signup.svg\" alt=\"\" />
        </div>
        <div>
          <div className=\"text-center max-w-lg px-1.5 m-auto\">
            <h3 className=\"text-bgray-900 dark:text-white font-semibold font-poppins text-4xl mb-4\">
              Speedy, Easy and Fast
            </h3>
            <p className=\"text-bgray-600 dark:text-darkblack-300 text-sm font-medium\">
              BankCo. helps you set saving goals, earn cash back offers, and get paychecks up to two days early. Get a
              <span className=\"text-success-300 font-bold\"> \$20</span> bonus when you receive qualifying direct deposits.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<!--scripts -->
<script src=\"/assets/js/jquery-3.6.0.min.js\"></script>
<script src=\"/assets/js/main.js\"></script>
</section>
"

# Create Redirect main page to dashboard
create_file "frontend/src/app/page.tsx" "import { redirect } from 'next/navigation';

export default function Page() {
  redirect('/dashboard');
}
"

echo "Created frontend/src/app/page.tsx to redirect main page to /dashboard."

# Step 3: Create Backend File Structure and Files

# Create directories
create_dir "backend/api/src/auth"
create_dir "backend/api/src/dto"
create_dir "backend/api/src/guards"
create_dir "backend/api/src/entities"

# Create auth.controller.ts
create_file "backend/api/src/auth/auth.controller.ts" "import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
    return this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}
"

# Create auth.service.ts
create_file "backend/api/src/auth/auth.service.ts" "import { Injectable, BadRequestException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { supabase } from '../supabaseClient';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    // Implement Supabase registration logic here
    const { email, password } = registerDto;
    const { user, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      throw new BadRequestException(error.message);
    }
    // Save user to your database if needed
    const newUser = this.usersRepository.create({ email: user?.email });
    return this.usersRepository.save(newUser);
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    // Implement Supabase login logic here
    const { email, password } = loginDto;
    const { session, error } = await supabase.auth.signIn({ email, password });
    if (error || !session) {
      throw new BadRequestException('Invalid credentials');
    }
    return { accessToken: session.access_token };
  }

  // Implement additional methods like resetPassword if needed
}
"

# Create auth.module.ts
create_file "backend/api/src/auth/auth.module.ts" "import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
"

# Create DTOs
create_file "backend/api/src/dto/login.dto.ts" "export class LoginDto {
  email: string;
  password: string;
}
"

create_file "backend/api/src/dto/register.dto.ts" "export class RegisterDto {
  email: string;
  password: string;
}
"

create_file "backend/api/src/dto/password-reset.dto.ts" "export class PasswordResetDto {
  email: string;
}
"

# Create JWT Guard (placeholder, implement as needed)
create_file "backend/api/src/guards/jwt-auth.guard.ts" "import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Implement JWT validation logic here
    return true;
  }
}
"

# Create User entity (placeholder, adjust fields as needed)
create_file "backend/api/src/entities/user.entity.ts" "import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  // Add additional fields as needed
}
"

# Create supabaseClient.ts in backend
create_file "backend/api/src/supabaseClient.ts" "import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
"

# Step 4: Update Dockerfile if necessary
# Check if Dockerfile exists
if [ -f "backend/api/Dockerfile" ]; then
  echo "Dockerfile already exists in backend/api/. Skipping Dockerfile creation."
else
  # Create a basic Dockerfile
  create_file "backend/api/Dockerfile" "FROM node:14-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ \"node\", \"dist/main.js\" ]
"
fi

# Step 5: Create Frontend Environment Variables Template
create_file ".env.local" "NEXT_PUBLIC_SUPABASE_URL=http://localhost:9999
NEXT_PUBLIC_SUPABASE_KEY=your_supabase_anon_key
SUPABASE_URL=http://localhost:9999
SUPABASE_KEY=your_supabase_service_role_key
"

echo "Environment variables template created at .env.local. Please update the keys accordingly."

# Step 6: Install Frontend Dependencies
echo "Installing frontend dependencies..."
cd frontend
npm install @supabase/supabase-js
npm install react-flatpickr aos slick-carousel swiper quill @fortawesome/react-fontawesome @fortawesome/free-brands-svg-icons
npm install --save-dev typescript @types/react @types/node
# Initialize TypeScript if not already initialized
if [ ! -f "tsconfig.json" ]; then
  npx tsc --init
  echo "Created tsconfig.json for TypeScript."
fi
cd ..

# Step 7: Install Backend Dependencies
echo "Installing backend dependencies..."
cd backend/api
npm install @supabase/supabase-js
npm install @nestjs/typeorm typeorm pg
npm install --save-dev typescript @types/node
# Initialize TypeScript if not already initialized
if [ ! -f "tsconfig.json" ]; then
  npx tsc --init
  echo "Created tsconfig.json for Backend TypeScript."
fi
cd ../../..

# Step 8: Display Completion Message
echo "Setup complete! Follow the steps below to continue:"
echo "1. Update the .env.local file with your Supabase keys."
echo "2. Start Supabase and Auth services using Docker Compose:"
echo "   docker-compose up -d"
echo "3. Start your backend server:"
echo "   cd backend/api && npm run start"
echo "4. Start your frontend server:"
echo "   cd frontend && npm run dev"
echo "5. Navigate to http://localhost:3000 to access the dashboard page or http://localhost:3000/login to access the login page."
echo "   To access the sign-up page, navigate to http://localhost:3000/signup."
echo
echo "Default login credentials for testing (if database is not connected):"
echo "Email: test@example.com"
echo "Password: password123"

