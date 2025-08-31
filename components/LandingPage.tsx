import Link from 'next/link';
import { AuthForm } from '@/components/auth-form';

export function LandingPage() {
  return (
    <div
      className="relative flex w-full min-h-screen flex-col bg-[#FFFFFF] justify-between overflow-x-hidden"
      style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
    >
      {/* Beta Sticker - position absolute i övre högra hörnet */}
      <div className="absolute top-0 right-0 z-10">
        <div className="bg-[#F04A4C] text-white transform rotate-45 translate-x-8 translate-y-4 shadow-md py-1 px-10 font-bold">
          <div className="text-center text-sm sm:text-base">BETA</div>
        </div>
      </div>

      <div>
        {/* Hero-sektion */}
        <div className="w-full">
          <div className="sm:p-4">
            <div
              className="flex min-h-[400px] sm:min-h-[480px] flex-col gap-4 sm:gap-6 bg-cover bg-center bg-no-repeat sm:gap-8 sm:rounded-xl items-center justify-center p-3 sm:p-4"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("/images/background.png")',
              }}
            >
              <div className="flex flex-col gap-2 text-center">
                <h1
                  className="text-white text-3xl sm:text-4xl font-black leading-tight tracking-[-0.033em] sm:text-5xl sm:font-black sm:leading-tight sm:tracking-[-0.033em]"
                >
                  Track Your Dinner Dates
                </h1>
                <h2 className="text-white text-sm font-normal leading-normal sm:text-base sm:font-normal sm:leading-normal">
                  Effortlessly organize and cherish your dining experiences.
                </h2>
              </div>
              <a 
                href="#auth-form"
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 sm:h-12 sm:px-5 bg-[#019863] text-[#FFFFFF] text-sm font-bold leading-normal tracking-[0.015em] sm:text-base sm:font-bold sm:leading-normal sm:tracking-[0.015em]"
              >
                <span className="truncate">Get Started</span>
              </a>
            </div>
          </div>
        </div>

        {/* Beta info banner */}
        <div className="bg-[#FFF8E1] border-y border-[#F9EBC8] py-2 px-4">
          <p className="text-center text-[#8B6E44] text-xs sm:text-sm">
            <span className="font-bold">BETA VERSION</span> - Free to use during beta. Will be offered as a premium service in the future. 
            We'd love your feedback! Email us at <a href="mailto:info@dinnertracker.com" className="underline hover:text-[#60432D]">info@dinnertracker.com</a>. 
            If you enjoy the service, please consider <a href="#" className="underline hover:text-[#60432D]">donating</a> to support development.
          </p>
        </div>

        {/* Info & Login sektion - Flexbox som ändrar riktning på desktop */}
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="flex flex-col md:flex-row md:items-start gap-10 md:gap-16">
            {/* Vänster kolumn med "Why use" text */}
            <div className="flex flex-col gap-6 md:flex-1">
              <div className="flex flex-col gap-4">
                <h1
                  className="text-[#1C160C] tracking-light text-2xl sm:text-[32px] font-bold leading-tight sm:text-4xl sm:font-black sm:leading-tight sm:tracking-[-0.033em]"
                >
                  What is Dinnertracker?
                </h1>
                <p className="text-[#1C160C] text-sm sm:text-base font-normal leading-normal">Ever caught yourself saying, "We should catch up with Pete and Kate!" Then comes the question: When was the last time? What did we eat?</p>
                
                <p className="text-[#1C160C] text-sm sm:text-base font-normal leading-normal">At Dinnertracker, we've been there too. That's why we created an app to track your dinners—who you shared them with, when, and what was on the table.</p>
                
                <p className="text-[#1C160C] text-sm sm:text-base font-normal leading-normal">No more repeat meals for the same guests. No more forgetting when you last saw friends. With Dinnertracker, all your dining history is at your fingertips.</p>
                
                <p className="text-[#1C160C] text-sm sm:text-base font-normal leading-normal">Dinnertracker – Because meals deserve memories.</p>
              </div>
              <a
                href="#auth-form"
                className="flex md:hidden min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 sm:h-12 sm:px-5 bg-[#019863] text-[#FFFFFF] text-sm font-bold leading-normal tracking-[0.015em] sm:text-base sm:font-bold sm:leading-normal sm:tracking-[0.015em] w-fit"
              >
                <span className="truncate">Learn More</span>
              </a>
            </div>

            {/* Höger kolumn med login form - synlig på desktop, dold på mobil */}
            <div className="hidden md:block md:w-[380px] md:min-w-[300px] md:shrink-0" id="auth-form">
              <div className="sticky top-24 bg-white p-6 rounded-xl border border-[#E9DFCE] shadow-md">
                <AuthForm />
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mx-auto max-w-6xl px-3 sm:px-4 py-6 sm:py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 p-0">
            {/* Feature 1 */}
            <div className="flex flex-1 gap-2 sm:gap-3 rounded-lg border border-[#E9DFCE] bg-[#FFFFFF] p-3 sm:p-4 flex-col">
              <div className="text-[#1C160C]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                  <path
                    d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Zm-96-88v64a8,8,0,0,1-16,0V132.94l-4.42,2.22a8,8,0,0,1-7.16-14.32l16-8A8,8,0,0,1,112,120Zm59.16,30.45L152,176h16a8,8,0,0,1,0,16H136a8,8,0,0,1-6.4-12.8l28.78-38.37A8,8,0,1,0,145.07,132a8,8,0,1,1-13.85-8A24,24,0,0,1,176,136,23.76,23.76,0,0,1,171.16,150.45Z"
                  ></path>
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-[#1C160C] text-base font-bold leading-tight">Organized Planning</h2>
                <p className="text-[#A18249] text-sm font-normal leading-normal">Easily schedule and track your dinners.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-1 gap-2 sm:gap-3 rounded-lg border border-[#E9DFCE] bg-[#FFFFFF] p-3 sm:p-4 flex-col">
              <div className="text-[#1C160C]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                  <path
                    d="M178,32c-20.65,0-38.73,8.88-50,23.89C116.73,40.88,98.65,32,78,32A62.07,62.07,0,0,0,16,94c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,220.66,240,164,240,94A62.07,62.07,0,0,0,178,32ZM128,206.8C109.74,196.16,32,147.69,32,94A46.06,46.06,0,0,1,78,48c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,147.61,146.24,196.15,128,206.8Z"
                  ></path>
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-[#1C160C] text-base font-bold leading-tight">Memorable Moments</h2>
                <p className="text-[#A18249] text-sm font-normal leading-normal">Capture and revisit your favorite meals.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-1 gap-2 sm:gap-3 rounded-lg border border-[#E9DFCE] bg-[#FFFFFF] p-3 sm:p-4 flex-col">
              <div className="text-[#1C160C]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                  <path
                    d="M246,98.73l-56-64A8,8,0,0,0,184,32H72a8,8,0,0,0-6,2.73l-56,64a8,8,0,0,0,.17,10.73l112,120a8,8,0,0,0,11.7,0l112-120A8,8,0,0,0,246,98.73ZM222.37,96H180L144,48h36.37ZM74.58,112l30.13,75.33L34.41,112Zm89.6,0L128,202.46,91.82,112ZM96,96l32-42.67L160,96Zm85.42,16h40.17l-70.3,75.33ZM75.63,48H112L76,96H33.63Z"
                  ></path>
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-[#1C160C] text-base font-bold leading-tight">Sophisticated Design</h2>
                <p className="text-[#A18249] text-sm font-normal leading-normal">Experience a sleek and modern interface.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section - visas bara på mobil */}
        <div className="md:hidden w-full">
          <div className="flex flex-col justify-end gap-4 sm:gap-6 px-3 sm:px-4 py-6 sm:py-10 sm:gap-8 sm:px-10">
            <div className="flex flex-col gap-2 text-center">
              <h1
                className="text-[#1C160C] tracking-light text-2xl sm:text-[32px] font-bold leading-tight sm:text-4xl sm:font-black sm:leading-tight sm:tracking-[-0.033em] max-w-[720px] mx-auto"
              >
                Start Tracking Today
              </h1>
              <p className="text-[#1C160C] text-base font-normal leading-normal max-w-[720px] mx-auto">
                Join thousands of users who love planning their dinners.
              </p>
            </div>
            <div className="flex flex-1 justify-center" id="mobile-auth-form">
              <AuthForm />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="flex flex-col gap-4 sm:gap-6 px-3 sm:px-5 py-6 sm:py-10 text-center bg-[#FAFAF8]">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 sm:flex-row sm:justify-around">
            <Link href="#" className="text-[#A18249] text-xs sm:text-base font-normal leading-normal min-w-[100px] sm:min-w-40 hover:text-[#1C160C] transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-[#A18249] text-xs sm:text-base font-normal leading-normal min-w-[100px] sm:min-w-40 hover:text-[#1C160C] transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="text-[#A18249] text-xs sm:text-base font-normal leading-normal min-w-[100px] sm:min-w-40 hover:text-[#1C160C] transition-colors">
              Contact Us
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="https://www.facebook.com/profile.php?id=61575793956723">
              <div className="text-[#A18249] hover:text-[#1C160C] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                  <path
                    d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm8,191.63V152h24a8,8,0,0,0,0-16H136V112a16,16,0,0,1,16-16h16a8,8,0,0,0,0-16H152a32,32,0,0,0-32,32v24H96a8,8,0,0,0,0,16h24v63.63a88,88,0,1,1,16,0Z"
                  ></path>
                </svg>
              </div>
            </Link>
            <Link href="https://www.instagram.com/dinnertracker/">
              <div className="text-[#A18249] hover:text-[#1C160C] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                  <path
                    d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM176,24H80A56.06,56.06,0,0,0,24,80v96a56.06,56.06,0,0,0,56,56h96a56.06,56.06,0,0,0,56-56V80A56.06,56.06,0,0,0,176,24Zm40,152a40,40,0,0,1-40,40H80a40,40,0,0,1-40-40V80A40,40,0,0,1,80,40h96a40,40,0,0,1,40,40ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z"
                  ></path>
                </svg>
              </div>
            </Link>
          </div>
          <p className="text-[#A18249] text-xs sm:text-base font-normal leading-normal">© 2025 Dinner Tracker</p>
        </footer>
      </div>
      <div>
        <div className="h-5 bg-[#FFFFFF]"></div>
      </div>
    </div>
  );
} 