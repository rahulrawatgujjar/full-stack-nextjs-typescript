"use client"

import { Separator } from "./ui/separator"

const Footer = () => {
  return (
    <>
      <div className="w-full h-2 shadow-md">
      </div>
      <footer className="text-center mx-4 md:mx-24 pt-6">
        <section className="m-5 text-md">
          <div id="foot" className=" w-full footer-start flex justify-center gap-5 sm:gap-16">
            <div className="linkedin cursor-pointer"
              onClick={() => window.open("https://www.linkedin.com/in/rahul-rawat-gujjar", "_blank")}
            >
              <i className="fa-brands fa-linkedin"></i>
              <p>LinkedIn</p>
            </div>
            <div className="email cursor-pointer"
              onClick={() => window.location.href = "mailto:rrg.rawat.developer@gmail.com?body=%0D%0A"}
            >
              <i className="fa-solid fa-envelope"></i>
              <p>Email</p>
            </div>
            <div className="insta cursor-pointer"
              onClick={() => window.open("https://www.instagram.com/rahul.rawat.rrg/", "_blank")}
            >
              <i className="fa-brands fa-square-instagram"></i>
              <p>Instagram</p>
            </div>
            <div className="x-twitter cursor-pointer"
              onClick={() => window.open("https://x.com/RahulRa02228239", "_blank")}
            >
              <i className="fa-brands fa-x-twitter"></i>
              <p>X-Twitter</p>
            </div>
          </div>
        </section>
        <section>
          {/* <Separator className="mx-auto w-[70%]" /> */}
          <span className="text-sm">&copy; 2024 | FeedbackCloak | All Rights Reserved</span>
        </section>
      </footer >
    </>
  )
}

export default Footer
