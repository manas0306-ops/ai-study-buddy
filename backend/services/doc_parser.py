import io
from typing import Optional
from pypdf import PdfReader

class DocumentParserService:
    """Extracts raw and formatted text from uploaded PDF, TXT, and DOCX files."""

    def extract_text(self, filename: str, file_bytes: bytes) -> str:
        fn_lower = filename.lower()
        if fn_lower.endswith(".pdf"):
            return self._extract_pdf(file_bytes)
        elif fn_lower.endswith(".txt") or fn_lower.endswith(".md"):
            return file_bytes.decode("utf-8", errors="replace")
        elif fn_lower.endswith(".docx"):
            # Basic plain text extraction for docx zip stream or text fallback
            return self._extract_docx(file_bytes)
        else:
            return file_bytes.decode("utf-8", errors="replace")

    def _extract_pdf(self, file_bytes: bytes) -> str:
        try:
            reader = PdfReader(io.BytesIO(file_bytes))
            text_parts = []
            for i, page in enumerate(reader.pages):
                page_text = page.extract_text()
                if page_text:
                    text_parts.append(f"--- Page {i+1} ---\n{page_text}")
            return "\n\n".join(text_parts) if text_parts else "No readable text detected in PDF."
        except Exception as e:
            return f"Error extracting PDF: {str(e)}"

    def _extract_docx(self, file_bytes: bytes) -> str:
        try:
            import zipfile
            import xml.etree.ElementTree as ET
            with zipfile.ZipFile(io.BytesIO(file_bytes)) as docx:
                xml_content = docx.read('word/document.xml')
                tree = ET.fromstring(xml_content)
                paragraphs = []
                for p in tree.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'):
                    texts = [node.text for node in p.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t') if node.text]
                    if texts:
                        paragraphs.append(''.join(texts))
                return '\n\n'.join(paragraphs)
        except Exception:
            return file_bytes.decode("utf-8", errors="replace")

doc_parser = DocumentParserService()
