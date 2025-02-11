// "use client";
// import { useEffect, useRef, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchFlavorRequests, voteOnFlavorRequest } from "@/redux/flavorRequestSlice";
// import { RootState, AppDispatch } from "@/redux/store";
// import FlavorRequestCard from "./Cards/FlavorRequestCard";
// import { getUserById } from "@/firebase/firestore";
// import CircularScrollbar from "./CircularScrollbar";
// import ParabolicCardView from "./ParabolicCardView";

// const FlavorRequest = () => {

//   const scrollContainerRef = useRef<HTMLDivElement>(null);
//   const [scrollWidth, setScrollWidth] = useState(0);
//   const [scrollPosition, setScrollPosition] = useState(0);
//   const [cards, setCards] = useState<string[]>([]);
//   const cardWidth = 220; // Card width plus margin

//   const dispatch = useDispatch<AppDispatch>();

//   // Fetch flavor requests and loading/error states from Redux store
//   const { flavorRequests, loading, error } = useSelector(
//     (state: RootState) => state.flavorRequests
//   );

//   // Get the logged-in user details from Redux store
//   const user = useSelector((state: RootState) => state.appUser.appUser);

//   // State to track the flavors the user has voted on
//   const [votedFlavorIds, setVotedFlavorIds] = useState<string[]>([]);

//   // State to store user details (name and profile picture) for each flavor request
//   const [userDetails, setUserDetails] = useState<{ [key: string]: { name: string; photoURL: string } }>({});

//   // Fetch flavor requests when the component mounts
//   useEffect(() => {
//     dispatch(fetchFlavorRequests());
//   }, [dispatch]);

//   // Load cards on component mount
//   useEffect(() => {
//     const loadCards = async () => {
//       const fetchedCards = await fetchFlavorRequests();
//       setCards(["dummy-start", ...fetchedCards, "dummy-end"]);
//     };
//     loadCards();
//   }, []);

//   // Fetch user details for each request
//   useEffect(() => {
//     const fetchUserDetails = async () => {
//       const userMap: { [key: string]: { name: string; photoURL: string } } = {};

//       for (const flavor of flavorRequests) {

//         // Fetch user details only if they are not already in state
//         if (!userDetails[flavor.createdByUserId]) {
//           const userData = await getUserById(flavor.createdByUserId);
//           if (userData) {
//             userMap[flavor.createdByUserId] = {
//               name: userData.name || "Unknown User",
//               photoURL: userData.photoURL || "/default-avatar.png"
//             };
//           }
//         }
//       }
//       // Update state with new user details
//       setUserDetails((prev) => ({ ...prev, ...userMap }));
//     };

//     if (flavorRequests.length > 0) {
//       fetchUserDetails();
//     }
//   }, [flavorRequests]);

//   // Handle user voting on a flavor request
//   const handleVote = (requestId: string) => {

//     if (!user) {
//       alert("You must be logged in to vote."); // Prevent voting if user is not logged in
//       return;
//     }

//     if (votedFlavorIds.includes(requestId)) {
//       alert("You have already voted for this flavor!"); // Prevent duplicate voting
//       return;
//     }

//     // Dispatch vote action to Redux
//     if (user) {
//       dispatch(voteOnFlavorRequest({ requestId, userId: user.uid }));
//     }

//     // Update voted flavors state
//     setVotedFlavorIds((prev) => [...prev, requestId]);
//   };

//   // Update scroll width on card load and window resize
//   useEffect(() => {
//     const container = scrollContainerRef.current;
//     if (!container) return;

//     const updateScrollMetrics = () => {
//       setScrollWidth(container.scrollWidth - container.clientWidth + cardWidth);
//     };

//     updateScrollMetrics();
//     window.addEventListener("resize", updateScrollMetrics);
//     return () => window.removeEventListener("resize", updateScrollMetrics);
//   }, [flavorRequests]);

//   // Update scroll position when the scrollbar changes
//   const handleSliderChange = (position: number) => {
//     if (scrollContainerRef.current) {
//       scrollContainerRef.current.scrollLeft = position;
//     }
//   };

//   // Ensure the parabolic effect is applied once cards load
//   useEffect(() => {
//     if (scrollContainerRef.current) {
//       scrollContainerRef.current.dispatchEvent(new Event("scroll"));
//     }
//   }, [flavorRequests]);

//   return (
//     <div className=" w-full overflow-x-auto">
//       {/* Show message if no flavor requests are found */}
//       {flavorRequests.length === 0 ? (
//         <p className="text-gray-600"></p>
//       ) : (
//         // Display flavor requests in a list
//         // <ul className="w-full h-[80vh] space-x-5 px-7 flex over overflow-y-auto items-center justify-evenly">
//         <div className="scroll-container" ref={scrollContainerRef}>
//           {flavorRequests.map((flavor) => (
//             <FlavorRequestCard
//               key={flavor.id} // Unique key for each item
//               flavor={flavor} // Pass flavor request details

//               // Pass user details
//               requestedBy={userDetails[flavor.createdByUserId] || { name: "Unknown User", photoURL: "/default-avatar.png" }}
//               onVote={handleVote} // Function to handle voting
//             />
//           ))}
//         </div>
//       )}
//       <ParabolicCardView
//         containerRef={scrollContainerRef}
//         onScrollPositionChange={setScrollPosition}
//       />
//       <CircularScrollbar
//         scrollWidth={scrollWidth}
//         scrollPosition={scrollPosition}
//         onScrollChange={handleSliderChange}
//       />
//     </div>
//   );
// };

// export default FlavorRequest;

"use client";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFlavorRequests, voteOnFlavorRequest } from "@/redux/flavorRequestSlice";
import { RootState, AppDispatch } from "@/redux/store";
import FlavorRequestCard from "./Cards/FlavorRequestCard";
import { getUserById } from "@/firebase/firestore";
import CircularScrollbar from "../components/CircularScrollbar";
import ParabolicCardView from "../components/ParabolicCardView";

const FlavorRequest = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { flavorRequests, loading, error } = useSelector((state: RootState) => state.flavorRequests);
  const user = useSelector((state: RootState) => state.appUser.appUser);

  const [votedFlavorIds, setVotedFlavorIds] = useState<string[]>([]);
  const [userDetails, setUserDetails] = useState<{ [key: string]: { name: string; photoURL: string } }>({});

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollWidth, setScrollWidth] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const cardWidth = 220;

  useEffect(() => {
    dispatch(fetchFlavorRequests());
  }, [dispatch]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userMap: { [key: string]: { name: string; photoURL: string } } = {};
      for (const flavor of flavorRequests) {
        if (!userDetails[flavor.createdByUserId]) {
          const userData = await getUserById(flavor.createdByUserId);
          if (userData) {
            userMap[flavor.createdByUserId] = {
              name: userData.name || "Unknown User",
              photoURL: userData.photoURL || "/default-avatar.png",
            };
          }
        }
      }
      setUserDetails((prev) => ({ ...prev, ...userMap }));
    };

    if (flavorRequests.length > 0) {
      fetchUserDetails();
    }
  }, [flavorRequests]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const updateScrollMetrics = () => {
      setScrollWidth(container.scrollWidth - container.clientWidth + cardWidth);
    };

    updateScrollMetrics();
    window.addEventListener("resize", updateScrollMetrics);
    return () => window.removeEventListener("resize", updateScrollMetrics);
  }, [flavorRequests]);

  const handleVote = (requestId: string) => {
    if (!user) {
      alert("You must be logged in to vote.");
      return;
    }
    if (votedFlavorIds.includes(requestId)) {
      alert("You have already voted for this flavor!");
      return;
    }
    dispatch(voteOnFlavorRequest({ requestId, userId: user.uid }));
    setVotedFlavorIds((prev) => [...prev, requestId]);
  };

  const handleSliderChange = (position: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = position;
    }
  };

  return (
    <div className="main-container">
      <h1 className="title">Flavor Requests</h1>
      <div className="scroll-container flex items-center overflow-x-auto whitespace-nowrap" ref={scrollContainerRef}>
        {/* Dummy Start Card */}
        {/* <div className="parabolic-card opacity-0 pointer-events-none w-[220px]"></div> */}
        <div className="text-transparent w-[220px] h-[300px] flex items-center justify-center  rounded-lg opacity-50">
          text
        </div>
        {flavorRequests.length === 0 ? (
          <p className="text-gray-600">No flavor requests yet.</p>
        ) : (
          <>
            {flavorRequests.map((flavor, index) => (
              <div key={flavor.id} className="parabolic-card">
                <FlavorRequestCard
                  flavor={flavor}
                  requestedBy={userDetails[flavor.createdByUserId] || { name: "Unknown User", photoURL: "/default-avatar.png" }}
                  onVote={handleVote}
                />
              </div>
            ))}
          </>
        )}
         <div className="text-transparent w-[220px] h-[300px] flex items-center justify-center  rounded-lg opacity-50">
          text
        </div>
      </div>

      <ParabolicCardView containerRef={scrollContainerRef} onScrollPositionChange={setScrollPosition} />
      <CircularScrollbar scrollWidth={scrollWidth} scrollPosition={scrollPosition} onScrollChange={handleSliderChange} />
    </div>
  );
};

export default FlavorRequest;
