import { createSignal, onMount, createEffect, Show } from 'solid-js';
import { Auth } from '@supabase/auth-ui-solid';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase, createEvent } from './supabaseClient';
import { saveAs } from 'file-saver';
import { Packer } from 'docx';
import { Document, Paragraph, TextRun } from 'docx';

function App() {
  const [user, setUser] = createSignal(null);
  const [currentPage, setCurrentPage] = createSignal('login');
  const [loading, setLoading] = createSignal(false);
  const [formData, setFormData] = createSignal({
    name: '',
    email: '',
    phone: '',
    address: '',
    education: '',
    experience: '',
    skills: '',
    summary: '',
  });
  const [generatedCV, setGeneratedCV] = createSignal('');
  
  const checkUserSignedIn = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      setCurrentPage('homePage');
    }
  };

  onMount(checkUserSignedIn);

  createEffect(() => {
    const authListener = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUser(session.user);
        setCurrentPage('homePage');
      } else {
        setUser(null);
        setCurrentPage('login');
      }
    });
    return () => {
      authListener.data.unsubscribe();
    };
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentPage('login');
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData(),
      [e.target.name]: e.target.value,
    });
  };

  const handleGenerateCV = async () => {
    setLoading(true);
    try {
      const prompt = `
        Generate a professional CV in Arabic using the following information:
        Name: ${formData().name}
        Email: ${formData().email}
        Phone: ${formData().phone}
        Address: ${formData().address}
        Education: ${formData().education}
        Experience: ${formData().experience}
        Skills: ${formData().skills}
        Summary: ${formData().summary}

        The CV should be well-formatted, professional, and suitable for someone who is blind using a screen reader.
        Provide the CV in markdown format.
      `;

      const result = await createEvent('chatgpt_request', {
        prompt: prompt,
        response_type: 'text',
      });
      setGeneratedCV(result);
    } catch (error) {
      console.error('Error generating CV:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadWord = async () => {
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [new TextRun(generatedCV())],
            }),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, 'CV.docx');
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4 text-gray-800">
      <Show
        when={currentPage() === 'homePage'}
        fallback={
          <div class="flex items-center justify-center min-h-screen">
            <div class="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
              <h2 class="text-3xl font-bold mb-6 text-center text-purple-600">Sign in with ZAPT</h2>
              <a
                href="https://www.zapt.ai"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-500 hover:underline mb-6 block text-center"
              >
                Learn more about ZAPT
              </a>
              <Auth
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa }}
                providers={['google', 'facebook', 'apple']}
                magicLink={true}
                view="magic_link"
                showLinks={false}
                authView="magic_link"
              />
            </div>
          </div>
        }
      >
        <div class="max-w-4xl mx-auto">
          <div class="flex justify-between items-center mb-8">
            <h1 class="text-4xl font-bold text-purple-600">CV Generator</h1>
            <button
              class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>

          <div class="bg-white p-8 rounded-xl shadow-md">
            <h2 class="text-2xl font-bold mb-6 text-purple-600">Fill in your information</h2>
            <form class="space-y-4" aria-label="CV Information Form">
              <div>
                <label for="name" class="block text-lg font-medium mb-1">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData().name}
                  onInput={handleInputChange}
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                  required
                />
              </div>
              <div>
                <label for="email" class="block text-lg font-medium mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData().email}
                  onInput={handleInputChange}
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                  required
                />
              </div>
              <div>
                <label for="phone" class="block text-lg font-medium mb-1">Phone</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData().phone}
                  onInput={handleInputChange}
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                  required
                />
              </div>
              <div>
                <label for="address" class="block text-lg font-medium mb-1">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData().address}
                  onInput={handleInputChange}
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                  required
                />
              </div>
              <div>
                <label for="education" class="block text-lg font-medium mb-1">Education</label>
                <textarea
                  id="education"
                  name="education"
                  value={formData().education}
                  onInput={handleInputChange}
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                  rows="3"
                  required
                ></textarea>
              </div>
              <div>
                <label for="experience" class="block text-lg font-medium mb-1">Experience</label>
                <textarea
                  id="experience"
                  name="experience"
                  value={formData().experience}
                  onInput={handleInputChange}
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                  rows="3"
                  required
                ></textarea>
              </div>
              <div>
                <label for="skills" class="block text-lg font-medium mb-1">Skills</label>
                <textarea
                  id="skills"
                  name="skills"
                  value={formData().skills}
                  onInput={handleInputChange}
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                  rows="2"
                  required
                ></textarea>
              </div>
              <div>
                <label for="summary" class="block text-lg font-medium mb-1">Summary</label>
                <textarea
                  id="summary"
                  name="summary"
                  value={formData().summary}
                  onInput={handleInputChange}
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                  rows="3"
                  required
                ></textarea>
              </div>
              <button
                type="button"
                class={`w-full px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${
                  loading() ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={handleGenerateCV}
                disabled={loading()}
              >
                {loading() ? 'Generating CV...' : 'Generate CV'}
              </button>
            </form>
          </div>

          <Show when={generatedCV()}>
            <div class="mt-8 bg-white p-8 rounded-xl shadow-md">
              <h2 class="text-2xl font-bold mb-4 text-purple-600">Your Generated CV</h2>
              <div class="prose max-w-none" innerHTML={generatedCV()}></div>
              <button
                class="mt-6 w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                onClick={handleDownloadWord}
              >
                Download as Word Document
              </button>
            </div>
          </Show>
        </div>
      </Show>
    </div>
  );
}

export default App;