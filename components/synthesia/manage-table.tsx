"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Track as TrackInterface, PickerPage } from "@/lib/interface";
import Tracks from "@/components/synthesia/tracks";
import { Button } from "@/components/ui/button";
import AddTrack from "./add-track";
import { CustomLink } from "@/components/ui/link";

const TABLE_HEADERS = {
  tracks: ["Track", "Palette", "Actions"],
  campaigns: ["Campaign", "Tracks", "Actions"],
}

interface ManageTableProps {
  type: "tracks" | "campaigns";
  tracks: TrackInterface[];
  campaigns: PickerPage[];
}

const CampaignRow = ({ data }: { data: PickerPage }) => (
  <>
    <Link href={`/synthesia/${data.page_name}`}>{data.page_name}</Link>
    <p>{data.track_count}</p>
    <div className="flex gap-2">
      <CustomLink href={`/synthesia/${data.page_name}`} variant="outline" size="synth">Edit</CustomLink>
      <CustomLink href={`/synthesia/${data.page_name}`} variant="outline" size="synth">View</CustomLink>
    </div>
  </>
);

const TrackRow = ({ data }: { data: TrackInterface }) => (
  <>
    <Link href={`/synthesia/tracks/${data.title}`}>{data.title}</Link>
    <audio controls controlsList="nodownload noplaybackrate" src={data.link}></audio>
    <div className="flex gap-2">
      <CustomLink href={`/synthesia/tracks/${data.title}`} variant="outline" size="synth">Edit</CustomLink>
      <CustomLink href={`/synthesia/tracks/${data.title}`} variant="outline" size="synth">View</CustomLink>
    </div>
  </>
);

export default function ManageTable({ type, tracks, campaigns }: ManageTableProps) {
  const router = useRouter();
  const tableData = type === "tracks" ? tracks : campaigns;
  const title = type === "tracks" ? "Manage Tracks" : "Manage Campaigns";
  const emptyMessage = `You have no ${type}. Create new ${type === "tracks" ? "Track" : "Campaign"} now.`;

  return (
    <div className="flex flex-col gap-4 w-full">
      <h2 className="text-xl font-bold">{title}</h2>
      <div className="flex flex-col gap-2 border rounded-lg">
        <div className="flex justify-between items-center p-2 border-b text-xs font-bold">
          {TABLE_HEADERS[type].map((header, index) => (
            <p key={index}>{header}</p>
          ))}
        </div>
        {tableData.length > 0 ? (
          tableData.map((data, index) => (
            <div key={index} className="flex justify-between items-center p-2 border-b text-xs">
              {type === "tracks" ? (
                <TrackRow data={data as TrackInterface} />
              ) : (
                <CampaignRow data={data as PickerPage} />
              )}
            </div>
          ))
        ) : (
          <div className="flex justify-between items-center p-4 border-b text-xs text-gray-400">
            <p>{emptyMessage}</p>
          </div>
        )}
      </div>
      <Button 
        onClick={() => router.push("/synthesia/publish")} 
        className="mt-2 mb-4" 
        size="sm"
      >
        {type === "tracks" ? "Upload Track" : "Create new Campaign"}
      </Button>
    </div>
  );
}