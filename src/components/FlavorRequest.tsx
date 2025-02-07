"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFlavorRequests, voteOnFlavorRequest } from "@/redux/flavorRequestSlice";
import { RootState, AppDispatch } from "@/redux/store";

const FlavorRequest = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { flavorRequests, loading, error } = useSelector(
    (state: RootState) => state.flavorRequests
  );
  const user = useSelector((state: RootState) => state.appUser.appUser); // Get logged-in user

  useEffect(() => {
    dispatch(fetchFlavorRequests());
  }, [dispatch]);

  const handleVote = (requestId: string) => {
    if (user) {
      dispatch(voteOnFlavorRequest({ requestId, userId: user.uid }));
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Flavor Requests</h2>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {flavorRequests.length === 0 ? (
        <p className="text-gray-600">No flavor requests found.</p>
      ) : (
        <ul className="space-y-6 flex items-center justify-evenly">
          {flavorRequests.map((flavor) => (
            <li key={flavor.id} className="bg-gray-100 p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-800">{flavor.flavorName}</h3>
              <p className="text-gray-700 mb-2">{flavor.description}</p>
              <p className="text-gray-600 mb-2">Votes: {flavor.votes}</p>

              {/* Vote Button */}
              <button
                onClick={() => handleVote(flavor.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
              >
                Vote
              </button>

              <br />
              {/* Reference URL */}
              <a
                href={flavor.referenceURL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline mt-2 block"
              >
                Reference
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FlavorRequest;
