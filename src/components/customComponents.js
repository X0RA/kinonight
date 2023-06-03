export const inputWithButton = () => {
  return (
    <div class="relative">
      <div class="absolute top-4 left-3">
        <i class="fa fa-search text-gray-400 z-20 hover:text-gray-500"></i>
      </div>
      <input
        type="text"
        class="h-14 w-96 pl-10 pr-20 rounded-lg z-0 focus:shadow focus:outline-none placeholder:italic"
        placeholder="Insert put.io share link here"
      />
      <div class="absolute top-2 right-2">
        <button class="h-10 w-20 text-white rounded-lg bg-primary-800 hover:bg-red-600">Set</button>
      </div>
    </div>
  );
};
