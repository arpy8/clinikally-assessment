FROM python:3.11.10

WORKDIR /code

RUN useradd -m -u 1000 appuser

RUN pip install --no-cache-dir uv
ENV VIRTUAL_ENV=/code/.venv
RUN uv venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

COPY requirements.txt .
RUN uv pip install --no-cache -r requirements.txt

COPY . .

RUN mkdir -p /code/data && chown -R appuser:appuser /code

USER appuser

ENV PORT=7860
EXPOSE $PORT

CMD ["python", "main.py"]