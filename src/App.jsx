import { createSignal, Show } from 'solid-js';
import { createEvent } from './supabaseClient';
import { saveAs } from 'file-saver';
import { Packer } from 'docx';
import { Document, Paragraph, TextRun } from 'docx';

function App() {
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
        أنشئ سيرة ذاتية احترافية باللغة العربية باستخدام المعلومات التالية:
        الاسم: ${formData().name}
        البريد الإلكتروني: ${formData().email}
        الهاتف: ${formData().phone}
        العنوان: ${formData().address}
        التعليم: ${formData().education}
        الخبرة: ${formData().experience}
        المهارات: ${formData().skills}
        الملخص: ${formData().summary}

        يجب أن تكون السيرة الذاتية منسقة جيدًا واحترافية ومناسبة لشخص كفيف يستخدم قارئ الشاشة.
        قدم السيرة الذاتية بتنسيق ماركداون.
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
      <div class="max-w-4xl mx-auto">
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-4xl font-bold text-purple-600">مولد السيرة الذاتية</h1>
        </div>

        <div class="bg-white p-8 rounded-xl shadow-md">
          <h2 class="text-2xl font-bold mb-6 text-purple-600">املأ معلوماتك</h2>
          <form class="space-y-4" aria-label="CV Information Form">
            <div>
              <label for="name" class="block text-lg font-medium mb-1">الاسم</label>
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
              <label for="email" class="block text-lg font-medium mb-1">البريد الإلكتروني</label>
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
              <label for="phone" class="block text-lg font-medium mb-1">الهاتف</label>
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
              <label for="address" class="block text-lg font-medium mb-1">العنوان</label>
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
              <label for="education" class="block text-lg font-medium mb-1">التعليم</label>
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
              <label for="experience" class="block text-lg font-medium mb-1">الخبرة</label>
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
              <label for="skills" class="block text-lg font-medium mb-1">المهارات</label>
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
              <label for="summary" class="block text-lg font-medium mb-1">الملخص</label>
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
              {loading() ? 'جارٍ إنشاء السيرة الذاتية...' : 'إنشاء السيرة الذاتية'}
            </button>
          </form>
        </div>

        <Show when={generatedCV()}>
          <div class="mt-8 bg-white p-8 rounded-xl shadow-md">
            <h2 class="text-2xl font-bold mb-4 text-purple-600">سيرتك الذاتية المُنشأة</h2>
            <div class="prose max-w-none" innerHTML={generatedCV()}></div>
            <button
              class="mt-6 w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              onClick={handleDownloadWord}
            >
              تنزيل كمستند Word
            </button>
          </div>
        </Show>
      </div>
    </div>
  );
}

export default App;