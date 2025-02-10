import { createClient } from "@/utils/supabase/server";
import Note from "./note";
import AddNote from "./add-note";

export default async function Notes() {
  const supabase = await createClient();

  const { data: notes, error } = await supabase.from("notes").select("*");

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="flex flex-col">
        {notes &&
          notes
            .filter((note) => {
              return note.inserted_at 
                && new Date(note.inserted_at).toDateString() === new Date().toDateString()
            })
            .map((note) => {
              return <Note key={note.id} note={note} />;
            })}
        <h4 className="text-center text-[#228B22] mb-2">Older Notes</h4>
        {notes &&
          notes
            .filter((note) => {
              return note.inserted_at 
                && new Date(note.inserted_at).toDateString() < new Date().toDateString()
            })
            .map((note) => {
              return <Note key={note.id} note={note} />;
            })}
        <AddNote />
      </div>
    </div>
  );
}