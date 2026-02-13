"""
Test de Conectividad - CRM Retarder México
Verifica conexión a Supabase: DB, Auth y Storage.
Uso: python3 tools/test_supabase.py
"""

import os
import sys
import json
from pathlib import Path
from datetime import datetime

# ── Cargar variables de entorno desde .env.local ──

def load_env():
    """Lee .env.local y carga las variables al entorno."""
    env_path = Path(__file__).resolve().parent.parent / ".env.local"
    if not env_path.exists():
        print("FAIL: .env.local no encontrado")
        sys.exit(1)

    loaded = {}
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            key, _, value = line.partition("=")
            key, value = key.strip(), value.strip()
            os.environ[key] = value
            loaded[key] = value
    return loaded


# ── Tests individuales ──

def test_env_variables(env_vars):
    """Verifica que las variables de entorno existan y no sean placeholders."""
    required = [
        "NEXT_PUBLIC_SUPABASE_URL",
        "NEXT_PUBLIC_SUPABASE_ANON_KEY",
        "SUPABASE_SERVICE_ROLE_KEY",
    ]
    results = {"pass": True, "details": []}

    for var in required:
        value = env_vars.get(var, "")
        if not value:
            results["details"].append(f"  FALTA: {var} no está definida")
            results["pass"] = False
        elif value in ("tu_url_aqui", "tu_key_aqui", "tu_service_key_aqui"):
            results["details"].append(f"  PLACEHOLDER: {var} = '{value}' (necesita valor real)")
            results["pass"] = False
        else:
            results["details"].append(f"  OK: {var} configurada")

    return results


def test_supabase_import():
    """Verifica que el SDK de Supabase esté instalado."""
    try:
        from supabase import create_client
        return {"pass": True, "details": ["  OK: supabase-py instalado correctamente"]}
    except ImportError:
        return {
            "pass": False,
            "details": [
                "  FALTA: supabase-py no instalado",
                "  FIX:   pip3 install supabase",
            ],
        }


def test_db_connection():
    """Intenta conectar a la base de datos Supabase y hacer un ping."""
    url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

    if not url or "tu_" in url or not key or "tu_" in key:
        return {"pass": False, "details": ["  SKIP: Credenciales no configuradas"]}

    try:
        from supabase import create_client
        client = create_client(url, key)
        # Ping: intentar listar tablas (query vacía a una tabla del sistema)
        result = client.table("_ping_test_").select("*").limit(1).execute()
        # Si llega aquí sin error de conexión, la DB responde
        return {"pass": True, "details": ["  OK: Conexión a PostgreSQL exitosa"]}
    except Exception as e:
        error_msg = str(e)
        # Un error 404/relation not found significa que SÍ conectó pero la tabla no existe (esperado)
        if "relation" in error_msg.lower() or "404" in error_msg or "not found" in error_msg.lower():
            return {"pass": True, "details": ["  OK: Conexión a PostgreSQL exitosa (DB responde)"]}
        return {"pass": False, "details": [f"  FAIL: {error_msg}"]}


def test_storage():
    """Verifica que Supabase Storage esté disponible."""
    url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

    if not url or "tu_" in url or not key or "tu_" in key:
        return {"pass": False, "details": ["  SKIP: Credenciales no configuradas"]}

    try:
        from supabase import create_client
        client = create_client(url, key)
        buckets = client.storage.list_buckets()
        return {"pass": True, "details": [f"  OK: Storage disponible ({len(buckets)} buckets encontrados)"]}
    except Exception as e:
        return {"pass": False, "details": [f"  FAIL: {str(e)}"]}


# ── Runner principal ──

def main():
    print("=" * 55)
    print("  TEST DE CONECTIVIDAD - CRM Retarder México")
    print(f"  {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 55)
    print()

    env_vars = load_env()

    tests = [
        ("1. Variables de entorno", test_env_variables, (env_vars,)),
        ("2. SDK supabase-py instalado", test_supabase_import, ()),
        ("3. Conexión a Base de Datos", test_db_connection, ()),
        ("4. Supabase Storage", test_storage, ()),
    ]

    all_passed = True
    results_summary = []

    for name, fn, args in tests:
        result = fn(*args) if args else fn()
        status = "PASS" if result["pass"] else "FAIL"
        icon = "+" if result["pass"] else "x"

        print(f"[{icon}] {name}: {status}")
        for detail in result["details"]:
            print(detail)
        print()

        if not result["pass"]:
            all_passed = False
        results_summary.append({"test": name, "status": status, "details": result["details"]})

    print("=" * 55)
    if all_passed:
        print("  RESULTADO: TODOS LOS TESTS PASARON")
        print("  >> Puedes avanzar a Fase A: Arquitectura")
    else:
        print("  RESULTADO: HAY TESTS FALLIDOS")
        print("  >> BLOQUEADO: Resuelve los fallos antes de continuar")
    print("=" * 55)

    return all_passed, results_summary


if __name__ == "__main__":
    passed, _ = main()
    sys.exit(0 if passed else 1)
