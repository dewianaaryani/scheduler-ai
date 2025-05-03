"use client";

import { useState, useRef, useEffect } from "react";
import { emojiList } from "../lib/emoji-list";

// Define types for our component
type EmojiItem = {
  emoji: string;
  label: string;
};

type EmojiSelectProps = {
  value?: string;
  onChange?: (emoji: string) => void;
};

export default function EmojiSelect({ value, onChange }: EmojiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState<EmojiItem | null>(
    value
      ? {
          emoji: value,
          label: emojiList.find((item) => item.emoji === value)?.label || value,
        }
      : null
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter emoji list based on search term
  const filteredEmojis = searchTerm
    ? emojiList.filter(
        (item) =>
          item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.emoji.includes(searchTerm)
      )
    : emojiList;

  // Handle clicking outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleEmojiSelect = (emoji: string, label: string) => {
    setSelectedEmoji({ emoji, label });
    if (onChange) {
      onChange(emoji);
    }
    setIsOpen(false);
    setSearchTerm("");
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm("");
    }
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Emoji selector button */}
      <button
        type="button"
        onClick={toggleDropdown}
        className="flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <div className="flex items-center">
          {selectedEmoji ? (
            <>
              <span className="text-xl mr-2">{selectedEmoji.emoji}</span>
              <span className="text-gray-700">{selectedEmoji.label}</span>
            </>
          ) : (
            <span className="text-gray-500">Select an emoji</span>
          )}
        </div>
        <svg
          className="h-5 w-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-64 overflow-auto">
          {/* Search input */}
          <div className="sticky top-0 bg-white p-2 border-b border-gray-200">
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search emojis..."
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Emoji list */}
          <div className="p-1">
            {filteredEmojis.length > 0 ? (
              <div className="grid grid-cols-4 gap-1">
                {filteredEmojis.map((item, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleEmojiSelect(item.emoji, item.label)}
                    className="flex flex-col items-center justify-center p-2 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <span className="text-2xl mb-1">{item.emoji}</span>
                    <span className="text-xs text-gray-600 truncate w-full text-center">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-3 text-center text-gray-500">
                No emojis found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
